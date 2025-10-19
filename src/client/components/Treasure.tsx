/**
 * Hazne (Treasure) Bileşeni
 * Oyuncuların topladıkları taşların bulunduğu büyük hazne
 */

import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { Player } from '../../types/game.types';
import { useTranslation } from 'react-i18next';

interface TreasureProps {
  stones: number;
  player: Player;
  isActive: boolean;
}

const Treasure: React.FC<TreasureProps> = ({ stones, player, isActive }) => {
  const { t } = useTranslation();
  const stoneColor = useGameStore((state) => state.stoneColor);

  const getStoneColorClass = () => {
    switch (stoneColor) {
      case 'red':
        return 'from-red-500 to-red-700';
      case 'white':
        return 'from-gray-100 to-gray-300';
      case 'blue':
        return 'from-blue-500 to-blue-700';
      default:
        return 'from-red-500 to-red-700';
    }
  };

  const playerColor = player === 'player1' ? 'blue' : 'red';

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Hazne */}
      <div
        className={`
          w-24 h-48 rounded-3xl
          flex flex-col items-center justify-center
          relative
          transition-all duration-300
          ${isActive ? 'shadow-xl ring-2 ring-yellow-400' : 'shadow-lg'}
        `}
        style={{
          background: `linear-gradient(180deg, #cd853f 0%, #8b4513 100%)`,
          boxShadow: isActive
            ? '0 8px 16px rgba(0, 0, 0, 0.3), inset 0 -8px 16px rgba(0, 0, 0, 0.4), 0 0 20px rgba(251, 191, 36, 0.5)'
            : 'inset 0 -8px 16px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Dekoratif çizgiler */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-yellow-600 rounded-full opacity-40"></div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-yellow-600 rounded-full opacity-40"></div>

        {/* Taş gösterimi */}
        <div className="relative flex flex-col items-center justify-center h-full">
          {/* Taş yığını görsel efekti */}
          {stones > 0 && (
            <div className="absolute inset-0 flex items-end justify-center pb-6">
              <div
                className={`w-14 rounded-t-full bg-gradient-to-br ${getStoneColorClass()} opacity-70`}
                style={{
                  height: `${Math.min((stones / 48) * 100, 90)}%`,
                  transition: 'height 0.5s ease-out'
                }}
              />
            </div>
          )}

          {/* Taş sayısı */}
          <div
            className={`
              relative z-10
              w-16 h-16 rounded-full
              flex items-center justify-center
              bg-gradient-to-br ${getStoneColorClass()}
              shadow-lg
              border-4
              ${playerColor === 'blue' ? 'border-blue-400' : 'border-red-400'}
            `}
          >
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              {stones}
            </span>
          </div>

          {/* Sparkle efekti (taş eklendiğinde) */}
          {isActive && stones > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-sparkle opacity-80"></div>
          )}
        </div>

        {/* Oyuncu etiketi */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <p className="text-xs text-gray-500 text-center">{t('score.stones')}</p>
        </div>
      </div>
    </div>
  );
};

export default Treasure;
