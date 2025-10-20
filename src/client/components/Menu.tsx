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
  const [player1Name, setPlayer1Name] = useState(t('game.player1'));
  const [player2Name, setPlayer2Name] = useState(t('game.player2'));
  const [showRules, setShowRules] = useState(false);
  const [showBotInfo, setShowBotInfo] = useState(false);

  // Dil değiştiğinde default isimleri güncelle
  React.useEffect(() => {
    setPlayer1Name(t('game.player1'));
    setPlayer2Name(t('game.player2'));
  }, [i18n.language, t]);

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
          {!showRules && !showBotInfo ? (
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
                  <div className="grid grid-cols-5 gap-2">
                    {(['beginner', 'easy', 'medium', 'hard', 'master'] as BotDifficulty[]).map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setBotDifficulty(difficulty)}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                          botDifficulty === difficulty
                            ? 'border-green-500 bg-green-500 bg-opacity-20'
                            : 'dark:border-gray-600 border-gray-400 dark:hover:border-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <span className="text-xs sm:text-sm dark:text-white text-gray-900">{t(`setup.${difficulty}`)}</span>
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
          ) : showRules ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">{t('rules.title')}</h3>
              <div className="max-h-96 overflow-y-auto space-y-2 text-sm">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((num) => (
                  <p key={num} className="dark:text-gray-300 text-gray-800">
                    {t(`rules.rule${num}`)}
                  </p>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t dark:border-gray-600 border-gray-300">
                <p className="text-xs dark:text-gray-400 text-gray-600">
                  Kaynak: <a href="https://www.mangala.com.tr/mangala-nasil-oynanir" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline">
                    www.mangala.com.tr/mangala-nasil-oynanir
                  </a>
                </p>
              </div>
            </div>
          ) : showBotInfo ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">🤖 {t('botInfo.title')}</h3>
              <div className="max-h-96 overflow-y-auto space-y-4 text-sm">
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <h4 className="font-bold text-lg mb-2 text-green-600 dark:text-green-400">🌱 {t('botInfo.beginner.name')}</h4>
                  <p className="dark:text-gray-300 text-gray-700 mb-1"><strong>{t('botInfo.beginner.algorithm')}</strong></p>
                  <p className="dark:text-gray-300 text-gray-700 mb-1"><strong>{t('botInfo.beginner.depth')}</strong></p>
                  <p className="dark:text-gray-300 text-gray-700">{t('botInfo.beginner.description')}</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <h4 className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">⭐ {t('botInfo.easy.name')}</h4>
                  <p className="dark:text-gray-300 text-gray-700 mb-1"><strong>{t('botInfo.easy.algorithm')}</strong></p>
                  <p className="dark:text-gray-300 text-gray-700 mb-1"><strong>{t('botInfo.easy.depth')}</strong></p>
                  <p className="dark:text-gray-300 text-gray-700">{t('botInfo.easy.description')}</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <h4 className="font-bold text-lg mb-2 text-yellow-600 dark:text-yellow-400">⚡ {t('botInfo.medium.name')}</h4>
                  <p className="dark:text-gray-300 text-gray-700 mb-1"><strong>{t('botInfo.medium.algorithm')}</strong></p>
                  <p className="dark:text-gray-300 text-gray-700 mb-1"><strong>{t('botInfo.medium.depth')}</strong></p>
                  <p className="dark:text-gray-300 text-gray-700">{t('botInfo.medium.description')}</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <h4 className="font-bold text-lg mb-2 text-orange-600 dark:text-orange-400">🔥 {t('botInfo.hard.name')}</h4>
                  <p className="dark:text-gray-300 text-gray-700 mb-1"><strong>{t('botInfo.hard.algorithm')}</strong></p>
                  <p className="dark:text-gray-300 text-gray-700 mb-1"><strong>{t('botInfo.hard.depth')}</strong></p>
                  <p className="dark:text-gray-300 text-gray-700">{t('botInfo.hard.description')}</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <h4 className="font-bold text-lg mb-2 text-purple-600 dark:text-purple-400">👑 {t('botInfo.master.name')}</h4>
                  <p className="dark:text-gray-300 text-gray-700 mb-1"><strong>{t('botInfo.master.algorithm')}</strong></p>
                  <p className="dark:text-gray-300 text-gray-700 mb-1"><strong>{t('botInfo.master.depth')}</strong></p>
                  <p className="dark:text-gray-300 text-gray-700">{t('botInfo.master.description')}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t dark:border-gray-600 border-gray-300">
                <p className="text-xs dark:text-gray-400 text-gray-600">
                  {t('botInfo.note')}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Alt Butonlar */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-2">
          <button
            onClick={() => {
              setShowRules(!showRules);
              setShowBotInfo(false);
            }}
            className="btn btn-secondary"
          >
            {showRules ? '⬅️ Geri' : '📖 Kurallar'}
          </button>

          <button
            onClick={() => {
              setShowBotInfo(!showBotInfo);
              setShowRules(false);
            }}
            className="btn btn-secondary"
          >
            {showBotInfo ? '⬅️ Geri' : '🤖 Bot Bilgisi'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
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
              <option value="kk">🇰🇿 KZ</option>
              <option value="en">🇬🇧 EN</option>
              <option value="ru">🇷🇺 RU</option>
            </select>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
