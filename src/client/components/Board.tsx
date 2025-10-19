/**
 * Mangala Oyun Tahtası Bileşeni
 * 12 küçük kuyu + 2 büyük hazne
 */

import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import Pit from './Pit';
import Treasure from './Treasure';
import { useTranslation } from 'react-i18next';

const Board: React.FC = () => {
  const { t } = useTranslation();
  const game = useGameStore((state) => state.game);
  const boardStyle = useGameStore((state) => state.boardStyle);
  const isAnimating = useGameStore((state) => state.isAnimating);
  const lastBotMoveRef = useRef<string>('');

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

  if (!game) return null;

  const currentSet = game.sets[game.currentSetIndex];
  const board = currentSet.board;
  const currentPlayer = currentSet.currentPlayer;

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
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      {/* Player 2 Bilgileri */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${currentPlayer === 'player2' ? 'text-yellow-500 animate-pulse' : 'dark:text-white text-gray-900'}`}>
          {game.player2Name}
          {currentPlayer === 'player2' && ` - ${t('game.yourTurn')}`}
        </h2>
        <p className="text-sm dark:text-gray-400 text-gray-600">{t('game.player2')}</p>
      </div>

      {/* Oyun Tahtası */}
      <div className={`${boardBgClass} rounded-3xl shadow-2xl p-8 relative`}>
        {/* İç Çerçeve */}
        <div className="absolute inset-4 border-4 border-yellow-600 rounded-2xl opacity-30"></div>

        <div className="flex items-center gap-6">
          {/* Player 2 Hazne (Sol) */}
          <Treasure
            stones={board.pits[13]}
            player="player2"
            isActive={currentPlayer === 'player2'}
          />

          {/* Kuyular */}
          <div className="flex flex-col gap-6">
            {/* Player 2 Kuyuları (Üst Sıra) */}
            <div className="flex gap-4">
              {player2Pits.map((pitIndex) => (
                <Pit
                  key={pitIndex}
                  pitIndex={pitIndex}
                  stones={board.pits[pitIndex]}
                  player="player2"
                  isActive={currentPlayer === 'player2'}
                />
              ))}
            </div>

            {/* Player 1 Kuyuları (Alt Sıra) */}
            <div className="flex gap-4">
              {player1Pits.map((pitIndex) => (
                <Pit
                  key={pitIndex}
                  pitIndex={pitIndex}
                  stones={board.pits[pitIndex]}
                  player="player1"
                  isActive={currentPlayer === 'player1'}
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

        {/* Tahta Detayları */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-200 text-xs font-semibold opacity-60">
          MANGALA
        </div>
      </div>

      {/* Player 1 Bilgileri */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${currentPlayer === 'player1' ? 'text-yellow-500 animate-pulse' : 'dark:text-white text-gray-900'}`}>
          {game.player1Name}
          {currentPlayer === 'player1' && ` - ${t('game.yourTurn')}`}
        </h2>
        <p className="text-sm dark:text-gray-400 text-gray-600">{t('game.player1')}</p>
      </div>

      {/* Skor Tablosu */}
      <div className="flex gap-8 mt-4">
        <div className="card text-center">
          <p className="text-sm dark:text-gray-400 text-gray-600">{game.player1Name}</p>
          <p className="text-3xl font-bold text-blue-500">{game.scores.player1}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm dark:text-gray-400 text-gray-600">{t('score.set')}</p>
          <p className="text-2xl font-bold dark:text-white text-gray-900">{game.currentSetIndex + 1} / 5</p>
        </div>
        <div className="card text-center">
          <p className="text-sm dark:text-gray-400 text-gray-600">{game.player2Name}</p>
          <p className="text-3xl font-bold text-red-500">{game.scores.player2}</p>
        </div>
      </div>
    </div>
  );
};

export default Board;
