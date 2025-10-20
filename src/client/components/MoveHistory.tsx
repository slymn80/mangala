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
    <div className="card p-4 max-h-[600px] overflow-y-auto w-64">
      <h3 className="font-bold text-lg mb-4 dark:text-white text-gray-900 border-b dark:border-gray-600 border-gray-300 pb-2">
        {t('moveHistory.title') || 'Hamle Geçmişi'}
      </h3>

      {moves.length === 0 ? (
        <p className="text-sm dark:text-gray-400 text-gray-600 text-center py-4">
          {t('moveHistory.empty') || 'Henüz hamle yapılmadı'}
        </p>
      ) : (
        <div className="space-y-2">
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
                className={`p-2 rounded-lg border-l-4 ${
                  move.player === 'player1'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-bold text-sm text-${playerColor}-600 dark:text-${playerColor}-400`}>
                      {playerName}
                    </span>
                    <p className="text-xs dark:text-gray-400 text-gray-600">
                      {t('moveHistory.pit') || 'Kuyu'}: {displayPitNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs dark:text-gray-500 text-gray-500">
                      #{index + 1}
                    </span>
                    {move.extraTurn && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        ⭐ {t('moveHistory.extraTurn') || 'Ekstra Tur'}
                      </p>
                    )}
                    {move.capturedStones > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        💎 +{move.capturedStones}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Set Bilgisi */}
      <div className="mt-4 pt-4 border-t dark:border-gray-600 border-gray-300">
        <p className="text-xs dark:text-gray-400 text-gray-600 text-center">
          {t('score.set')}: {game.currentSetIndex + 1} / 5
        </p>
        <p className="text-xs dark:text-gray-400 text-gray-600 text-center">
          {t('moveHistory.totalMoves') || 'Toplam Hamle'}: {moves.length}
        </p>
      </div>
    </div>
  );
};

export default MoveHistory;
