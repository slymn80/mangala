/**
 * Mangala Oyun State Management (Zustand)
 */

import { create } from 'zustand';
import type { GameState, SetState } from '../../types/game.types';
import { initializeGame, applyMove, updateGameScore } from '../../engine/engine';
import { getBotMove } from '../../engine/bot';

// Ses çalma helper fonksiyonu
const playSound = (soundFile: string, volume: number, enabled: boolean) => {
  if (!enabled) return;
  const audio = new Audio(soundFile);
  audio.volume = volume / 100;
  audio.play().catch(() => {
    // Ses çalınamadı, sessizce devam et
  });
};

interface GameStore {
  // State
  game: GameState | null;
  selectedPit: number | null;
  isAnimating: boolean;
  message: string | null;
  isBotThinking: boolean;

  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  animationsEnabled: boolean;
  theme: 'light' | 'dark';
  boardStyle: 'wood' | 'metal' | 'plastic';
  stoneColor: 'red' | 'white' | 'blue';

  // Actions
  startNewGame: (params: any) => void;
  makeMove: (pitIndex: number) => void;
  selectPit: (pitIndex: number | null) => void;
  setMessage: (message: string | null) => void;
  setAnimating: (isAnimating: boolean) => void;

  // Settings Actions
  toggleSound: () => void;
  toggleMusic: () => void;
  setVolume: (volume: number) => void;
  toggleAnimations: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setBoardStyle: (style: 'wood' | 'metal' | 'plastic') => void;
  setStoneColor: (color: 'red' | 'white' | 'blue') => void;

  // Bot
  makeBotMove: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  game: null,
  selectedPit: null,
  isAnimating: false,
  message: null,
  isBotThinking: false,

  // Default Settings
  soundEnabled: true,
  musicEnabled: true,
  volume: 70,
  animationsEnabled: true,
  theme: 'light',
  boardStyle: 'wood',
  stoneColor: 'blue',

  // Actions
  startNewGame: (params) => {
    const game = initializeGame(params);
    set({ game, selectedPit: null, message: null, isAnimating: false, isBotThinking: false });
    // Bot sırası kontrolü artık Board.tsx useEffect'inde yapılıyor
  },

  makeMove: (pitIndex) => {
    const { game, isAnimating } = get();

    console.log('[MOVE] makeMove çağrıldı:', { pitIndex, gameExists: !!game, isAnimating });

    if (!game || isAnimating) {
      console.log('[MOVE] Hamle reddedildi - oyun yok veya animating:', { gameExists: !!game, isAnimating });
      return;
    }

    const currentSet = game.sets[game.currentSetIndex];

    if (currentSet.status === 'finished') {
      set({ message: 'Set bitti!' });
      return;
    }

    // Hamle yap
    set({ isAnimating: true });

    const result = applyMove(game, pitIndex);

    if (!result.success) {
      set({ message: result.message, isAnimating: false });
      setTimeout(() => set({ message: null }), 2000);
      return;
    }

    // Game state güncelle
    const updatedSet: SetState = {
      ...currentSet,
      board: result.board,
      currentPlayer: result.nextPlayer,
      status: result.setFinished ? 'finished' : 'active',
      winner: result.setWinner,
      moves: [
        ...currentSet.moves,
        {
          player: currentSet.currentPlayer,
          pitIndex,
          timestamp: Date.now(),
          resultState: result.board,
          capturedStones: result.capturedStones,
          extraTurn: result.extraTurn
        }
      ]
    };

    const newSets = [...game.sets];
    newSets[game.currentSetIndex] = updatedSet;

    let updatedGame: GameState = {
      ...game,
      sets: newSets
    };

    // State'i güncelle (önce!)
    set({ game: updatedGame, selectedPit: null });

    // Set bittiyse skor güncelle
    if (result.setFinished && result.setWinner) {
      updatedGame = updateGameScore(updatedGame, result.setWinner);
      set({ game: updatedGame, isAnimating: false });

      // Set bitişi sesi ve mesajı
      const { soundEnabled, volume } = get();
      if (updatedGame.status === 'finished') {
        // Oyun bitti
        playSound('/assets/sounds/applause-cheer-236786.mp3', volume, soundEnabled);
      } else {
        // Set bitti
        playSound('/assets/sounds/level-complete-394515.mp3', volume, soundEnabled);
      }

      set({ message: `Set bitti! Kazanan: ${result.setWinner}` });
      setTimeout(() => set({ message: null }), 2000);

      // Bot sırası kontrolü artık Board.tsx useEffect'inde yapılıyor
      console.log('[SET BİTTİ] Yeni set başladı:', {
        currentSetIndex: updatedGame.currentSetIndex,
        currentPlayer: updatedGame.sets[updatedGame.currentSetIndex]?.currentPlayer
      });
    } else {
      // Mesaj ve ses göster
      const { soundEnabled, volume } = get();

      if (result.extraTurn) {
        playSound('/assets/sounds/combine-special-394482.mp3', volume, soundEnabled);
        set({ message: 'Ekstra tur!' });
        setTimeout(() => set({ message: null }), 1500);
      } else if (result.capturedStones > 0) {
        playSound('/assets/sounds/clear-combo-4-394493.mp3', volume, soundEnabled);
        set({ message: `${result.capturedStones} taş yakalandı!` });
        setTimeout(() => set({ message: null }), 1500);
      }

      const animationTime = get().animationsEnabled ? 600 : 100;
      const isBotNext = updatedGame.mode === 'pve' && result.nextPlayer === 'player2' && !result.setFinished;

      setTimeout(() => {
        set({ isAnimating: false });
        // Bot sırası kontrolü artık Board.tsx useEffect'inde yapılıyor
        if (isBotNext) {
          console.log('[HAMLE SONRASI] Bot sırası - Board useEffect otomatik çağıracak');
        }
      }, animationTime);
    }
  },

  selectPit: (pitIndex) => {
    set({ selectedPit: pitIndex });
  },

  setMessage: (message) => {
    set({ message });
  },

  setAnimating: (isAnimating) => {
    set({ isAnimating });
  },

  // Settings
  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },

  toggleMusic: () => {
    set((state) => ({ musicEnabled: !state.musicEnabled }));
  },

  setVolume: (volume) => {
    set({ volume });
  },

  toggleAnimations: () => {
    set((state) => ({ animationsEnabled: !state.animationsEnabled }));
  },

  setTheme: (theme) => {
    set({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },

  setBoardStyle: (boardStyle) => {
    set({ boardStyle });
  },

  setStoneColor: (stoneColor) => {
    set({ stoneColor });
  },

  // Bot
  makeBotMove: () => {
    const state = get();
    const { game } = state;

    console.log('[BOT] makeBotMove çağrıldı', {
      gameExists: !!game,
      isAnimating: state.isAnimating,
      isBotThinking: state.isBotThinking,
      mode: game?.mode,
      currentPlayer: game?.sets[game?.currentSetIndex]?.currentPlayer,
      setStatus: game?.sets[game?.currentSetIndex]?.status
    });

    // Temel kontroller
    if (!game || game.mode !== 'pve') {
      console.log('[BOT] Hamle yapılamadı - oyun yok veya PvE değil');
      return;
    }

    const currentSet = game.sets[game.currentSetIndex];

    if (currentSet.currentPlayer !== 'player2' || currentSet.status === 'finished') {
      console.log('[BOT] Hamle yapılamadı - player2 değil veya set bitti');
      return;
    }

    // isAnimating true yap - böylece aynı anda birden fazla bot hamlesi engellensin
    set({ isAnimating: true, message: 'Düşünüyor...' });

    // Bot hamlesini hesapla - Tüm zorluk seviyeleri aktif
    const difficulty = game.difficulty || 'easy';
    const thinkTime = difficulty === 'easy' ? 300 : difficulty === 'medium' ? 500 : 800;

    const botMove = getBotMove(
      game,
      game.currentSetIndex,
      difficulty,
      thinkTime
    );

    console.log('[BOT] Bot hamlesi hesaplandı:', botMove);

    if (botMove === -1) {
      console.log('[BOT] Bot hamle yapamadı - geçerli hamle yok');
      set({ isAnimating: false, message: null });
      return;
    }

    // Normal insan hızında hamle yap (1-2 saniye arası düşünme süresi)
    const thinkingTime = game.difficulty === 'easy' ? 800 : game.difficulty === 'medium' ? 1200 : 1500;

    setTimeout(() => {
      set({ message: null, isAnimating: false }); // isAnimating'i false yap ki makeMove kabul etsin
      console.log('[BOT] Hamle yapılıyor:', botMove);

      // Tekrar kontrol et - game state değişmiş olabilir
      const currentGame = get().game;
      if (currentGame && currentGame.sets[currentGame.currentSetIndex].currentPlayer === 'player2') {
        get().makeMove(botMove);
      }
    }, thinkingTime);
  }
}));
