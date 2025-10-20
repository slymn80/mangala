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
  const animatedPit = useGameStore((state) => state.animatedPit);
  const { playSound } = useSounds();

  const isSelected = selectedPit === pitIndex;
  const canClick = isActive && stones > 0 && !isAnimating;
  const isReceivingStone = animatedPit === pitIndex; // Bu kuyu şu anda taş alıyor mu?

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
    // Player 1 (alt sıra, 0-5): beyaz taşlar
    // Player 2 (üst sıra, 7-12): siyah taşlar
    if (pitIndex >= 0 && pitIndex <= 5) {
      // Player 1 - Beyaz taşlar
      return 'bg-gradient-to-br from-gray-100 to-gray-300 border border-gray-400';
    } else if (pitIndex >= 7 && pitIndex <= 12) {
      // Player 2 - Siyah taşlar
      return 'bg-gradient-to-br from-gray-700 to-gray-900';
    }

    // Fallback (hazne için, ama bu component'te hazne yok)
    return 'bg-gradient-to-br from-blue-700 to-blue-900';
  };

  const stoneColorClass = getStoneColorClass();

  // Kullanıcı dostu kuyu numarası: 1-12
  // Player 1 (0-5) → 1-6, Player 2 (7-12) → 7-12
  const displayNumber = pitIndex >= 0 && pitIndex <= 5 ? pitIndex + 1 : pitIndex;

  return (
    <div className="relative flex flex-col items-center">
      {/* Kuyu Numarası - 1'den başlayarak 12'ye kadar */}
      <span className="text-xs sm:text-sm font-bold text-yellow-600 dark:text-yellow-400 mb-0.5 sm:mb-1 drop-shadow-md">{displayNumber}</span>

      {/* Kuyu - Artık sadece taşların konteyneri, arka plan yok */}
      <div
        onClick={handleClick}
        className={`
          w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full
          flex items-center justify-center
          relative cursor-pointer
          transition-all duration-200
          ${canClick ? 'hover:scale-110' : 'opacity-80 cursor-not-allowed'}
          ${isSelected ? 'ring-2 sm:ring-4 ring-yellow-400 shadow-glow scale-110' : ''}
          ${isStartPit ? 'ring-2 sm:ring-3 ring-green-500' : ''}
          ${isEndPit ? 'ring-2 sm:ring-3 ring-purple-500' : ''}
          ${isReceivingStone ? 'ring-4 ring-cyan-400 scale-125 animate-pulse' : ''}
        `}
        style={{
          boxShadow: isSelected
            ? '0 0 20px rgba(251, 191, 36, 0.8)'
            : isReceivingStone
            ? '0 0 25px rgba(34, 211, 238, 0.9)'
            : isStartPit
            ? '0 0 15px rgba(34, 197, 94, 0.6)'
            : isEndPit
            ? '0 0 15px rgba(168, 85, 247, 0.6)'
            : 'none'
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
                    <span className={`absolute inset-0 flex items-center justify-center font-bold text-xs sm:text-sm md:text-lg ${
                      pitIndex >= 0 && pitIndex <= 5 ? 'text-gray-800' : 'text-white'
                    }`}>
                      {stones}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Boş kuyu - hiçbir şey gösterme, tahta resmi kendi kuyularını gösteriyor */}
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
