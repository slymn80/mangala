/**
 * Hamle Geçmişi Bileşeni
 * Oyunculların yaptığı hamleleri listeler
 */

import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from 'react-i18next';

const MoveHistory: React.FC = () => {
  const { t } = useTranslation();
  const game = useGameStore((state) => state.game);

  if (!game) return null;

  const currentSet = game.sets[game.currentSetIndex];
  const moves = currentSet.moves;

  return (
    <div className="card p-3 max-h-[70vh] overflow-y-auto w-48">
      <h3 className="font-bold text-sm mb-3 dark:text-white text-gray-900 border-b dark:border-gray-600 border-gray-300 pb-2">
        {t('moveHistory.title') || 'Hamle Geçmişi'}
      </h3>

      {moves.length === 0 ? (
        <p className="text-xs dark:text-gray-400 text-gray-600 text-center py-3">
          {t('moveHistory.empty') || 'Henüz hamle yapılmadı'}
        </p>
      ) : (
        <div className="space-y-1.5">
          {moves.map((move, index) => {
            // Kuyu numarasını kullanıcı dostu formatta göster (1-12)
            const displayPitNumber = move.pitIndex >= 0 && move.pitIndex <= 5
              ? move.pitIndex + 1
              : move.pitIndex;

            const playerColor = move.player === 'player1' ? 'blue' : 'red';
            const playerName = move.player === 'player1' ? game.player1Name : game.player2Name;

            return (
              <div
                key={index}
                className={`p-1.5 rounded border-l-3 ${
                  move.player === 'player1'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-xs ${
                      move.player === 'player1'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {playerName}
                    </span>
                    <span className="text-[10px] dark:text-gray-500 text-gray-500">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-[10px] dark:text-gray-400 text-gray-600">
                    {t('moveHistory.pit') || 'Kuyu'}: {displayPitNumber}
                  </p>
                  {(move.extraTurn || move.capturedStones > 0) && (
                    <div className="flex gap-2 text-[10px]">
                      {move.extraTurn && (
                        <span className="text-yellow-600 dark:text-yellow-400">⭐</span>
                      )}
                      {move.capturedStones > 0 && (
                        <span className="text-green-600 dark:text-green-400">
                          💎 +{move.capturedStones}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Set Bilgisi */}
      <div className="mt-3 pt-3 border-t dark:border-gray-600 border-gray-300">
        <p className="text-[10px] dark:text-gray-400 text-gray-600 text-center">
          {t('score.set')}: {game.currentSetIndex + 1} / 5
        </p>
        <p className="text-[10px] dark:text-gray-400 text-gray-600 text-center">
          {t('moveHistory.totalMoves') || 'Toplam'}: {moves.length}
        </p>
      </div>
    </div>
  );
};

export default MoveHistory;
