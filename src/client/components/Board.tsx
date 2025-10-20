/**
 * Mangala Oyun Tahtası Bileşeni
 * 12 küçük kuyu + 2 büyük hazne
 */

import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import Pit from './Pit';
import Treasure from './Treasure';
import { useTranslation } from 'react-i18next';

const Board: React.FC = () => {
  const { t } = useTranslation();
  const game = useGameStore((state) => state.game);
  const boardStyle = useGameStore((state) => state.boardStyle);
  const isAnimating = useGameStore((state) => state.isAnimating);
  const theme = useGameStore((state) => state.theme);
  const setTheme = useGameStore((state) => state.setTheme);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const volume = useGameStore((state) => state.volume);
  const setVolume = useGameStore((state) => state.setVolume);
  const lastBotMoveRef = useRef<string>('');
  const [showSettings, setShowSettings] = useState(false);

  // Bot sırası kontrolü - Her state değişiminde kontrol et
  useEffect(() => {
    if (!game || isAnimating || game.mode !== 'pve') {
      return;
    }

    const currentSet = game.sets[game.currentSetIndex];

    if (currentSet.currentPlayer === 'player2' && currentSet.status === 'active') {
      // Aynı durumda birden fazla bot hamlesi çağrılmasını engelle
      const currentState = `${game.currentSetIndex}-${currentSet.moves.length}`;
      if (lastBotMoveRef.current === currentState) {
        console.log('[BOARD USEEFFECT] Aynı durum, bot hamlesi zaten çağrıldı, skip');
        return;
      }
      lastBotMoveRef.current = currentState;

      console.log('[BOARD USEEFFECT] Bot sırası tespit edildi, bot hamlesi çağrılacak', {
        isAnimating,
        currentSetIndex: game.currentSetIndex,
        setStatus: currentSet.status,
        moveCount: currentSet.moves.length
      });

      // Timeout kullanmadan direkt çağır - isAnimating false olduğunda zaten güvenli
      console.log('[BOARD USEEFFECT] Bot hamlesi çağrılıyor - useGameStore.getState().makeBotMove()');
      useGameStore.getState().makeBotMove();
    }
  }, [game?.currentSetIndex, game?.sets[game?.currentSetIndex || 0]?.currentPlayer, isAnimating]);

  if (!game) return null;

  const currentSet = game.sets[game.currentSetIndex];
  const board = currentSet.board;
  const currentPlayer = currentSet.currentPlayer;

  // Player 2'nin kuyuları (üst sıra, ters sırada görüntülenir: 12, 11, 10, 9, 8, 7)
  const player2Pits = [12, 11, 10, 9, 8, 7];

  // Player 1'in kuyuları (alt sıra: 0, 1, 2, 3, 4, 5)
  const player1Pits = [0, 1, 2, 3, 4, 5];

  const boardBgClass =
    boardStyle === 'wood'
      ? 'bg-gradient-to-br from-amber-700 to-amber-900'
      : boardStyle === 'metal'
      ? 'bg-gradient-to-br from-slate-600 to-slate-800'
      : 'bg-gradient-to-br from-blue-500 to-blue-700';

  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 md:gap-8 p-2 sm:p-4 md:p-8 relative">
      {/* Settings Button - Sağ Üst */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-2 right-2 z-50 btn btn-secondary p-2 rounded-full w-10 h-10 flex items-center justify-center"
        title="Ayarlar"
      >
        ⚙️
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-14 right-2 z-50 card p-4 space-y-4 min-w-[200px]">
          <h3 className="font-bold text-sm dark:text-white text-gray-900">{t('settings.title') || 'Ayarlar'}</h3>

          {/* Tema */}
          <div className="flex items-center justify-between">
            <span className="text-xs dark:text-gray-300 text-gray-700">{t('theme.theme') || 'Tema'}</span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn btn-secondary px-3 py-1 text-xs"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Ses Açma/Kapama */}
          <div className="flex items-center justify-between">
            <span className="text-xs dark:text-gray-300 text-gray-700">{t('settings.sound') || 'Ses'}</span>
            <button
              onClick={toggleSound}
              className="btn btn-secondary px-3 py-1 text-xs"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>

          {/* Ses Seviyesi */}
          {soundEnabled && (
            <div className="space-y-1">
              <label className="text-xs dark:text-gray-300 text-gray-700">{t('settings.volume') || 'Ses Seviyesi'}: {volume}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      {/* Player 2 Bilgileri */}
      <div className="text-center">
        <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${currentPlayer === 'player2' ? 'text-yellow-500 animate-pulse' : 'dark:text-white text-gray-900'}`}>
          {game.player2Name}
          {currentPlayer === 'player2' && ` - ${t('game.yourTurn')}`}
        </h2>
        <p className="text-xs sm:text-sm dark:text-gray-400 text-gray-600">{t('game.player2')}</p>
      </div>

      {/* Oyun Tahtası */}
      <div className={`${boardBgClass} rounded-2xl md:rounded-3xl shadow-2xl p-2 sm:p-4 md:p-8 relative w-full max-w-4xl`}>
        {/* İç Çerçeve */}
        <div className="absolute inset-4 border-4 border-yellow-600 rounded-2xl opacity-30"></div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
          {/* Player 2 Hazne (Sol) */}
          <Treasure
            stones={board.pits[13]}
            player="player2"
            isActive={currentPlayer === 'player2'}
          />

          {/* Kuyular */}
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-6">
            {/* Player 2 Kuyuları (Üst Sıra) */}
            <div className="flex gap-1 sm:gap-2 md:gap-4">
              {player2Pits.map((pitIndex) => (
                <Pit
                  key={pitIndex}
                  pitIndex={pitIndex}
                  stones={board.pits[pitIndex]}
                  player="player2"
                  isActive={currentPlayer === 'player2'}
                />
              ))}
            </div>

            {/* Player 1 Kuyuları (Alt Sıra) */}
            <div className="flex gap-1 sm:gap-2 md:gap-4">
              {player1Pits.map((pitIndex) => (
                <Pit
                  key={pitIndex}
                  pitIndex={pitIndex}
                  stones={board.pits[pitIndex]}
                  player="player1"
                  isActive={currentPlayer === 'player1'}
                />
              ))}
            </div>
          </div>

          {/* Player 1 Hazne (Sağ) */}
          <Treasure
            stones={board.pits[6]}
            player="player1"
            isActive={currentPlayer === 'player1'}
          />
        </div>

        {/* Tahta Detayları */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-200 text-xs font-semibold opacity-60">
          MANGALA
        </div>
      </div>

      {/* Player 1 Bilgileri */}
      <div className="text-center">
        <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${currentPlayer === 'player1' ? 'text-yellow-500 animate-pulse' : 'dark:text-white text-gray-900'}`}>
          {game.player1Name}
          {currentPlayer === 'player1' && ` - ${t('game.yourTurn')}`}
        </h2>
        <p className="text-xs sm:text-sm dark:text-gray-400 text-gray-600">{t('game.player1')}</p>
      </div>

      {/* Skor Tablosu */}
      <div className="flex gap-3 sm:gap-4 md:gap-8 mt-2 md:mt-4">
        <div className="card text-center p-2 sm:p-3 md:p-4">
          <p className="text-xs sm:text-sm dark:text-gray-400 text-gray-600">{game.player1Name}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">{game.scores.player1}</p>
        </div>
        <div className="card text-center p-2 sm:p-3 md:p-4">
          <p className="text-xs sm:text-sm dark:text-gray-400 text-gray-600">{t('score.set')}</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold dark:text-white text-gray-900">{game.currentSetIndex + 1} / 5</p>
        </div>
        <div className="card text-center p-2 sm:p-3 md:p-4">
          <p className="text-xs sm:text-sm dark:text-gray-400 text-gray-600">{game.player2Name}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500">{game.scores.player2}</p>
        </div>
      </div>
    </div>
  );
};

export default Board;
