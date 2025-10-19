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
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      {/* Hazne */}
      <div
        className={`
          w-16 h-32 sm:w-20 sm:h-40 md:w-24 md:h-48 rounded-2xl sm:rounded-3xl
          flex flex-col items-center justify-center
          relative
          transition-all duration-300
          ${isActive ? 'shadow-xl ring-1 sm:ring-2 ring-yellow-400' : 'shadow-lg'}
        `}
        style={{
          background: `linear-gradient(180deg, #cd853f 0%, #8b4513 100%)`,
          boxShadow: isActive
            ? '0 8px 16px rgba(0, 0, 0, 0.3), inset 0 -8px 16px rgba(0, 0, 0, 0.4), 0 0 20px rgba(251, 191, 36, 0.5)'
            : 'inset 0 -8px 16px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Dekoratif çizgiler */}
        <div className="absolute top-2 sm:top-3 md:top-4 left-1/2 transform -translate-x-1/2 w-10 sm:w-12 md:w-16 h-0.5 sm:h-1 bg-yellow-600 rounded-full opacity-40"></div>
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 w-10 sm:w-12 md:w-16 h-0.5 sm:h-1 bg-yellow-600 rounded-full opacity-40"></div>

        {/* Taş gösterimi */}
        <div className="relative flex flex-col items-center justify-center h-full">
          {/* Taş yığını görsel efekti */}
          {stones > 0 && (
            <div className="absolute inset-0 flex items-end justify-center pb-3 sm:pb-4 md:pb-6">
              <div
                className={`w-8 sm:w-10 md:w-14 rounded-t-full bg-gradient-to-br ${getStoneColorClass()} opacity-70`}
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
              w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full
              flex items-center justify-center
              bg-gradient-to-br ${getStoneColorClass()}
              shadow-lg
              border-2 sm:border-3 md:border-4
              ${playerColor === 'blue' ? 'border-blue-400' : 'border-red-400'}
            `}
          >
            <span className="text-sm sm:text-lg md:text-2xl font-bold text-white drop-shadow-lg">
              {stones}
            </span>
          </div>

          {/* Sparkle efekti (taş eklendiğinde) */}
          {isActive && stones > 0 && (
            <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-sparkle opacity-80"></div>
          )}
        </div>

        {/* Oyuncu etiketi */}
        <div className="absolute -bottom-6 sm:-bottom-7 md:-bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <p className="text-[10px] sm:text-xs text-gray-500 text-center">{t('score.stones')}</p>
        </div>
      </div>
    </div>
  );
};

export default Treasure;
