/**
 * Ana Menü Bileşeni
 * Oyun başlatma ve ayarlar
 */

import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from 'react-i18next';
import type { GameMode, BotDifficulty } from '../../types/game.types';

interface MenuProps {
  onStartGame: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStartGame }) => {
  const { t, i18n } = useTranslation();
  const startNewGame = useGameStore((state) => state.startNewGame);
  const theme = useGameStore((state) => state.theme);
  const setTheme = useGameStore((state) => state.setTheme);

  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');
  const [player1Name, setPlayer1Name] = useState('Oyuncu 1');
  const [player2Name, setPlayer2Name] = useState('Oyuncu 2');
  const [showRules, setShowRules] = useState(false);

  const handleStartGame = () => {
    startNewGame({
      mode: gameMode,
      player1Name,
      player2Name: gameMode === 'pve' ? t('game.bot') : player2Name,
      botDifficulty: gameMode === 'pve' ? botDifficulty : undefined
    });
    onStartGame();
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen flex flex-col p-2 sm:p-4">
      {/* Logo ve Okul Adı - Sol Üst Köşe */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8 fade-in">
        <img
          src="/assets/images/okul_logo.jpg"
          alt="Okul Logo"
          className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain rounded-lg shadow-md"
        />
        <div className="flex flex-col">
          <h2 className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
            Özel Talgar 1 Nolu Yatılı Lisesi
          </h2>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            MANGALA
          </h1>
        </div>
      </div>

      {/* Ana İçerik - Ortalanmış */}
      <div className="flex-1 flex items-center justify-center px-2">
        <div className="max-w-2xl w-full">
          {/* Başlık */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8 fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              {t('game.title')}
            </h2>
          </div>

        {/* Ana Kart */}
        <div className="card mb-4 sm:mb-6 bounce-in">
          {!showRules ? (
            <div className="space-y-6">
              {/* Oyun Modu */}
              <div>
                <label className="block text-sm font-semibold mb-3 dark:text-white text-gray-900">{t('setup.gameMode')}</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGameMode('pvp')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      gameMode === 'pvp'
                        ? 'border-blue-500 bg-blue-500 bg-opacity-20 shadow-lg'
                        : 'dark:border-gray-600 border-gray-400 dark:hover:border-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-4xl mb-2">👥</div>
                    <div className="font-semibold dark:text-white text-gray-900">{t('setup.pvp')}</div>
                  </button>
                  <button
                    onClick={() => setGameMode('pve')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      gameMode === 'pve'
                        ? 'border-blue-500 bg-blue-500 bg-opacity-20 shadow-lg'
                        : 'dark:border-gray-600 border-gray-400 dark:hover:border-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-4xl mb-2">🤖</div>
                    <div className="font-semibold dark:text-white text-gray-900">{t('setup.pve')}</div>
                  </button>
                </div>
              </div>

              {/* Bot Zorluğu (sadece PvE modunda) */}
              {gameMode === 'pve' && (
                <div className="slide-up">
                  <label className="block text-sm font-semibold mb-3 dark:text-white text-gray-900">{t('setup.botDifficulty')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['easy', 'medium', 'hard'] as BotDifficulty[]).map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setBotDifficulty(difficulty)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          botDifficulty === difficulty
                            ? 'border-green-500 bg-green-500 bg-opacity-20'
                            : 'dark:border-gray-600 border-gray-400 dark:hover:border-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <span className="dark:text-white text-gray-900">{t(`setup.${difficulty}`)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Oyuncu İsimleri */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-900">{t('setup.player1Name')}</label>
                  <input
                    type="text"
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    className="w-full p-3 rounded-lg dark:bg-gray-800 bg-white dark:border-gray-600 border-gray-300 border-2 focus:border-blue-500 outline-none transition-colors dark:text-white text-gray-900"
                    maxLength={20}
                  />
                </div>

                {gameMode === 'pvp' && (
                  <div className="slide-up">
                    <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-900">{t('setup.player2Name')}</label>
                    <input
                      type="text"
                      value={player2Name}
                      onChange={(e) => setPlayer2Name(e.target.value)}
                      className="w-full p-3 rounded-lg dark:bg-gray-800 bg-white dark:border-gray-600 border-gray-300 border-2 focus:border-blue-500 outline-none transition-colors dark:text-white text-gray-900"
                      maxLength={20}
                    />
                  </div>
                )}
              </div>

              {/* Başlat Butonu */}
              <button onClick={handleStartGame} className="btn btn-primary w-full text-lg py-4">
                {t('setup.startGame')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">{t('rules.title')}</h3>
              <div className="max-h-96 overflow-y-auto space-y-2 text-sm">
                {Array.from({ length: 23 }, (_, i) => i + 1).map((num) => (
                  <p key={num} className="dark:text-gray-300 text-gray-800">
                    {t(`rules.rule${num}`)}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Alt Butonlar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setShowRules(!showRules)}
            className="btn btn-secondary"
          >
            {showRules ? '⬅️ Geri' : '📖 Kurallar'}
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn btn-secondary"
          >
            {theme === 'dark' ? '☀️' : '🌙'} {t('theme.theme')}
          </button>

          <div className="relative">
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="btn btn-secondary w-full appearance-none"
            >
              <option value="tr">🇹🇷 TR</option>
              <option value="en">🇬🇧 EN</option>
              <option value="kk">🇰🇿 KK</option>
            </select>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
