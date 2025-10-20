/**
 * Ana Uygulama Bileşeni
 */

import React, { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import Menu from './components/Menu';
import Board from './components/Board';
import GameOverModal from './components/GameOverModal';
import MessageToast from './components/MessageToast';
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  const { t } = useTranslation();
  const game = useGameStore((state) => state.game);
  const theme = useGameStore((state) => state.theme);
  const clearGame = useGameStore((state) => state.clearGame);
  const [showMenu, setShowMenu] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Tema uygula
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    // Oyun varsa menüyü kapat
    if (game && showMenu) {
      setShowMenu(false);
    }
  }, [game]);

  // Bot sırası kontrolü artık gameStore içinde yapılıyor

  const handleStartGame = () => {
    setShowMenu(false);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleQuitToMenu = () => {
    clearGame(); // Oyunu temizle - localStorage'dan da silinir
    setShowMenu(true);
    setIsPaused(false);
  };

  const handleRefresh = () => {
    if (!game) return;

    // Oyun bittiyse direkt yenile, onay sorma
    if (game.status === 'finished') {
      const gameStore = useGameStore.getState();
      gameStore.startNewGame({
        mode: game.mode,
        player1Name: game.player1Name,
        player2Name: game.player2Name,
        botDifficulty: game.botDifficulty
      });
      setIsPaused(false);
      return;
    }

    // Oyun devam ediyorsa onay iste
    if (window.confirm(t('menu.confirmRestart'))) {
      const gameStore = useGameStore.getState();
      gameStore.startNewGame({
        mode: game.mode,
        player1Name: game.player1Name,
        player2Name: game.player2Name,
        botDifficulty: game.botDifficulty
      });
      setIsPaused(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{
      background: theme === 'dark'
        ? 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)'
        : 'linear-gradient(to bottom right, #f9fafb, #e5e7eb, #f9fafb)',
      color: theme === 'dark' ? '#f1f5f9' : '#111827'
    }}>
      {/* Header */}
      {!showMenu && game && (
        <header className={`sticky top-0 z-50 backdrop-blur-sm border-b px-2 sm:px-4 md:px-6 py-2 sm:py-3 transition-colors ${
          theme === 'dark'
            ? 'bg-gray-900 bg-opacity-90 border-gray-700'
            : 'bg-white bg-opacity-90 border-gray-300'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Sol: Logo ve Okul Adı */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <img
                src="/assets/images/okul_logo.jpg"
                alt="Okul Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 object-contain rounded-lg shadow-md"
              />
              <div className="flex flex-col">
                <h2 className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hidden sm:block">
                  Özel Talgar 1 Nolu Yatılı Lisesi
                </h2>
                <h1 className="text-sm sm:text-base md:text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  MANGALA
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 ml-1 sm:ml-2">
                {t('score.set')} {game.currentSetIndex + 1} / 5
              </div>
            </div>

            {/* Sağ: Kontrol Butonları */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <button
                onClick={handleRefresh}
                className="btn btn-success px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">🔄 {t('menu.refresh')}</span>
                <span className="sm:hidden">🔄</span>
              </button>
              <button
                onClick={handlePause}
                className="btn btn-secondary px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">{isPaused ? '▶️ ' + t('menu.continue') : '⏸️ ' + t('menu.pause')}</span>
                <span className="sm:hidden">{isPaused ? '▶️' : '⏸️'}</span>
              </button>
              <button
                onClick={handleQuitToMenu}
                className="btn btn-danger px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">🏠 {t('menu.quit')}</span>
                <span className="sm:hidden">🏠</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Ana İçerik */}
      <main className="container mx-auto">
        {showMenu || !game ? (
          <Menu onStartGame={handleStartGame} />
        ) : (
          <>
            {isPaused ? (
              <div className="min-h-[80vh] flex items-center justify-center">
                <div className="card text-center space-y-6 max-w-md">
                  <h2 className="text-4xl font-bold">⏸️</h2>
                  <h3 className="text-2xl font-semibold">{t('menu.pause')}</h3>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handlePause}
                      className="btn btn-primary w-full"
                    >
                      {t('menu.continue')}
                    </button>
                    <button
                      onClick={handleQuitToMenu}
                      className="btn btn-secondary w-full"
                    >
                      {t('menu.quit')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Board />
            )}
          </>
        )}
      </main>

      {/* Oyun Sonu Modalı */}
      {game && game.status === 'finished' && <GameOverModal />}

      {/* Mesaj Toast */}
      <MessageToast />

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        <p>Mangala - Türk Zeka ve Strateji Oyunu © 2025</p>
        <p className="mt-1">by Süleyman Tongut</p>
      </footer>
    </div>
  );
};

export default App;
