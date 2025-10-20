/**
 * Mangala Oyun Tahtası Bileşeni
 * 12 küçük kuyu + 2 büyük hazne
 */

import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import Pit from './Pit';
import Treasure from './Treasure';
import MoveHistory from './MoveHistory';
import { useTranslation } from 'react-i18next';

const Board: React.FC = () => {
  const { t, i18n } = useTranslation();
  const game = useGameStore((state) => state.game);
  const boardStyle = useGameStore((state) => state.boardStyle);
  const isAnimating = useGameStore((state) => state.isAnimating);
  const theme = useGameStore((state) => state.theme);
  const setTheme = useGameStore((state) => state.setTheme);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const volume = useGameStore((state) => state.volume);
  const setVolume = useGameStore((state) => state.setVolume);
  const lastMove = useGameStore((state) => state.lastMove);
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

  if (!game) {
    console.log('[BOARD] Game yok, render edilmiyor');
    return null;
  }

  const currentSet = game.sets[game.currentSetIndex];

  if (!currentSet) {
    console.error('[BOARD] Current set bulunamadı!', {
      currentSetIndex: game.currentSetIndex,
      totalSets: game.sets.length
    });
    return <div className="text-center p-8 text-red-500">Set yükleniyor...</div>;
  }

  const board = currentSet.board;
  const currentPlayer = currentSet.currentPlayer;

  console.log('[BOARD RENDER]', {
    setIndex: game.currentSetIndex,
    setStatus: currentSet.status,
    currentPlayer,
    gameStatus: game.status
  });

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
    <div className="flex flex-row items-start justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 p-2 sm:p-4 md:p-6 lg:p-8 min-h-[80vh]">
      {/* Ana oyun alanı - Sol ve Orta */}
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
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

          {/* Dil Seçici */}
          <div className="space-y-1">
            <label className="text-xs dark:text-gray-300 text-gray-700">{t('settings.language') || 'Dil'}</label>
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="w-full p-2 rounded dark:bg-gray-700 bg-white dark:text-white text-gray-900 text-xs border dark:border-gray-600 border-gray-300"
            >
              <option value="tr">🇹🇷 TR</option>
              <option value="kk">🇰🇿 KZ</option>
              <option value="en">🇬🇧 EN</option>
              <option value="ru">🇷🇺 RU</option>
            </select>
          </div>
        </div>
      )}

      {/* Skor Tablosu - EN ÜSTTE */}
      <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-8">
        <div className="card text-center p-2 sm:p-3 md:p-4 min-w-[80px] sm:min-w-[100px] md:min-w-[120px]">
          <p className="text-[10px] sm:text-xs md:text-sm dark:text-gray-400 text-gray-600 mb-1">{game.player1Name}</p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-500">{game.scores.player1}</p>
        </div>
        <div className="card text-center p-2 sm:p-3 md:p-4 min-w-[80px] sm:min-w-[100px] md:min-w-[120px]">
          <p className="text-[10px] sm:text-xs md:text-sm dark:text-gray-400 text-gray-600 mb-1">{t('score.set')}</p>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold dark:text-white text-gray-900">{game.currentSetIndex + 1} / 5</p>
          <p className="text-[10px] sm:text-xs md:text-sm text-yellow-500 mt-1 sm:mt-2 animate-pulse font-semibold">
            {t('messages.turnIndicator', { player: currentPlayer === 'player1' ? game.player1Name : game.player2Name })}
          </p>
        </div>
        <div className="card text-center p-2 sm:p-3 md:p-4 min-w-[80px] sm:min-w-[100px] md:min-w-[120px]">
          <p className="text-[10px] sm:text-xs md:text-sm dark:text-gray-400 text-gray-600 mb-1">{game.player2Name}</p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-500">{game.scores.player2}</p>
        </div>
      </div>

      {/* Player 2 İsmi - Üstte */}
      <div className="text-center">
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-red-500 drop-shadow-md">
          {game.player2Name}
        </h3>
      </div>

      {/* Oyun Tahtası - Ortada */}
      <div
        className="rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 relative"
        style={{
          background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 50%, #8b4513 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Ahşap Doku Efekti */}
        <div
          className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-20 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(101, 67, 33, 0.3) 2px,
              rgba(101, 67, 33, 0.3) 4px
            )`
          }}
        />

        {/* İç Çerçeve - Dekoratif */}
        <div className="absolute inset-2 sm:inset-3 md:inset-4 border-2 sm:border-3 md:border-4 border-yellow-700 rounded-xl sm:rounded-2xl opacity-40"
          style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)' }}
        />

        {/* Logo - Ortada */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-20">
          <img
            src="/assets/images/okul_logo.jpg"
            alt="Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain rounded-full"
            style={{ filter: 'brightness(1.5) contrast(0.8)' }}
          />
        </div>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-8">
          {/* Player 2 Hazne (Sol) */}
          <Treasure
            stones={board.pits[13]}
            player="player2"
            isActive={currentPlayer === 'player2'}
          />

          {/* Kuyular */}
          <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-6">
            {/* Player 2 Kuyuları (Üst Sıra) */}
            <div className="flex gap-0.5 sm:gap-1 md:gap-2 lg:gap-4">
              {player2Pits.map((pitIndex) => (
                <Pit
                  key={pitIndex}
                  pitIndex={pitIndex}
                  stones={board.pits[pitIndex]}
                  player="player2"
                  isActive={currentPlayer === 'player2'}
                  isStartPit={lastMove?.startPit === pitIndex}
                  isEndPit={lastMove?.endPit === pitIndex}
                />
              ))}
            </div>

            {/* Player 1 Kuyuları (Alt Sıra) */}
            <div className="flex gap-0.5 sm:gap-1 md:gap-2 lg:gap-4">
              {player1Pits.map((pitIndex) => (
                <Pit
                  key={pitIndex}
                  pitIndex={pitIndex}
                  stones={board.pits[pitIndex]}
                  player="player1"
                  isActive={currentPlayer === 'player1'}
                  isStartPit={lastMove?.startPit === pitIndex}
                  isEndPit={lastMove?.endPit === pitIndex}
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
      </div>

      {/* Player 1 İsmi - Altta */}
      <div className="text-center">
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-500 drop-shadow-md">
          {game.player1Name}
        </h3>
      </div>
      </div>

      {/* Hamle Geçmişi - Sağda */}
      <div className="hidden lg:block">
        <MoveHistory />
      </div>
    </div>
  );
};

export default Board;
