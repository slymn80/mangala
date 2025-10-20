/**
 * Kuyu (Pit) Bileşeni
 * Taşların bulunduğu küçük kuyular
 */

import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useSounds } from '../hooks/useSounds';
import type { Player } from '../../types/game.types';

interface PitProps {
  pitIndex: number;
  stones: number;
  player: Player; // eslint-disable-line @typescript-eslint/no-unused-vars
  isActive: boolean;
  isStartPit?: boolean; // Son hamlenin başlangıç kuyusu
  isEndPit?: boolean; // Son hamlenin bitiş kuyusu
}

const Pit: React.FC<PitProps> = ({ pitIndex, stones, isActive, isStartPit = false, isEndPit = false }) => {
  const makeMove = useGameStore((state) => state.makeMove);
  const selectedPit = useGameStore((state) => state.selectedPit);
  const selectPit = useGameStore((state) => state.selectPit);
  const isAnimating = useGameStore((state) => state.isAnimating);
  const stoneColor = useGameStore((state) => state.stoneColor);
  const { playSound } = useSounds();

  const isSelected = selectedPit === pitIndex;
  const canClick = isActive && stones > 0 && !isAnimating;

  const handleClick = () => {
    if (!canClick) return;

    if (isSelected) {
      // İkinci tıklama - hamleyi yap
      playSound('move');
      makeMove(pitIndex);
      selectPit(null);
    } else {
      // İlk tıklama - kuyuyu seç
      playSound('click');
      selectPit(pitIndex);
    }
  };

  const getStoneColorClass = () => {
    switch (stoneColor) {
      case 'red':
        return 'bg-gradient-to-br from-red-500 to-red-700';
      case 'white':
        return 'bg-gradient-to-br from-gray-100 to-gray-300 border border-gray-400';
      case 'blue':
        return 'bg-gradient-to-br from-blue-700 to-blue-900';
      default:
        return 'bg-gradient-to-br from-red-500 to-red-700';
    }
  };

  const stoneColorClass = getStoneColorClass();

  return (
    <div className="relative flex flex-col items-center">
      {/* Kuyu İndeksi (Debug - isteğe bağlı) */}
      <span className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">{pitIndex}</span>

      {/* Kuyu */}
      <div
        onClick={handleClick}
        className={`
          w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full
          flex items-center justify-center
          relative cursor-pointer
          transition-all duration-300
          ${canClick ? 'hover:scale-110 hover:shadow-lg' : 'opacity-60 cursor-not-allowed'}
          ${isSelected ? 'ring-2 sm:ring-4 ring-yellow-400 shadow-glow scale-110' : ''}
          ${isStartPit ? 'ring-2 sm:ring-3 ring-green-500' : ''}
          ${isEndPit ? 'ring-2 sm:ring-3 ring-purple-500' : ''}
          ${isActive && stones > 0 ? 'shadow-md' : ''}
        `}
        style={{
          background: 'radial-gradient(circle at 30% 30%, #d2691e, #8b4513)',
          boxShadow: isSelected
            ? '0 0 20px rgba(251, 191, 36, 0.8), inset 0 -4px 8px rgba(0, 0, 0, 0.4)'
            : isStartPit
            ? '0 0 15px rgba(34, 197, 94, 0.6), inset 0 -4px 8px rgba(0, 0, 0, 0.4)'
            : isEndPit
            ? '0 0 15px rgba(168, 85, 247, 0.6), inset 0 -4px 8px rgba(0, 0, 0, 0.4)'
            : 'inset 0 -4px 8px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Taş Sayısı */}
        <div className="absolute inset-0 flex items-center justify-center">
          {stones > 0 && (
            <div className="relative">
              {/* Taşlar (görsel olarak üst üste) */}
              <div className="flex items-center justify-center relative">
                {stones <= 6 ? (
                  // 6 ve daha az taş için ayrı ayrı göster
                  <div className="flex flex-wrap gap-0.5 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 items-center justify-center">
                    {Array.from({ length: Math.min(stones, 6) }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full ${stoneColorClass} shadow-sm`}
                        style={{
                          transform: `rotate(${i * 15}deg) translateY(${i % 2 ? -1 : 1}px)`,
                          zIndex: i
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  // 7+ taş için sadece sayı göster
                  <div className="relative">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full ${stoneColorClass} shadow-lg`} />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-lg">
                      {stones}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {stones === 0 && (
            <span className="text-gray-600 text-2xl opacity-20">○</span>
          )}
        </div>
      </div>

      {/* Hover bilgisi */}
      {canClick && (
        <div className="absolute -bottom-6 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          {isSelected ? 'Oyna' : 'Seç'}
        </div>
      )}
    </div>
  );
};

export default Pit;
