/**
 * MANGALA BOT AI
 * Üç zorluk seviyesi: Kolay, Orta, Zor
 * - Kolay: Rastgele + basit heuristik
 * - Orta: Minimax (derinlik 4-6)
 * - Zor: Alpha-Beta Pruning + Gelişmiş heuristik
 */

import type { BoardState, BotDifficulty, Player, SetState } from '../types/game.types';
import { getValidMoves, applyMove } from './engine';

/**
 * Bot'un hamlesini hesapla
 */
export function getBotMove(
  gameState: any,
  setIndex: number,
  difficulty: BotDifficulty,
  maxThinkTime: number = 300
): number {
  const set = gameState.sets[setIndex];
  const player = set.currentPlayer;
  const validMoves = getValidMoves(set, player);

  if (validMoves.length === 0) {
    return -1;
  }

  if (validMoves.length === 1) {
    return validMoves[0];
  }

  switch (difficulty) {
    case 'easy':
      return getEasyMove(set, player, validMoves);
    case 'medium':
      return getMediumMove(gameState, setIndex, player, validMoves, maxThinkTime);
    case 'hard':
      return getHardMove(gameState, setIndex, player, validMoves, maxThinkTime);
    default:
      return validMoves[0];
  }
}

/**
 * KOLAY BOT: Rastgele + basit öncelikler
 */
function getEasyMove(set: SetState, player: Player, validMoves: number[]): number {
  // %70 rastgele, %30 akıllı
  if (Math.random() < 0.7) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  // Basit öncelik: Hazneye ulaşan hamle varsa onu seç
  const playerTreasure = player === 'player1' ? 6 : 13;

  for (const move of validMoves) {
    const stones = set.board.pits[move];
    const landingIndex = (move + stones) % 14;

    if (landingIndex === playerTreasure) {
      return move;
    }
  }

  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

/**
 * ORTA BOT: Minimax algoritması
 */
function getMediumMove(
  gameState: any,
  setIndex: number,
  player: Player,
  validMoves: number[],
  maxThinkTime: number
): number {
  const depth = 4;
  let bestMove = validMoves[0];
  let bestScore = -Infinity;

  const startTime = Date.now();

  for (const move of validMoves) {
    if (Date.now() - startTime > maxThinkTime) break;

    const score = minimax(gameState, setIndex, move, depth - 1, false, player);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * ZOR BOT: Alpha-Beta Pruning + Gelişmiş heuristik
 */
function getHardMove(
  gameState: any,
  setIndex: number,
  player: Player,
  validMoves: number[],
  maxThinkTime: number
): number {
  const depth = 6;
  let bestMove = validMoves[0];
  let bestScore = -Infinity;

  const startTime = Date.now();

  for (const move of validMoves) {
    if (Date.now() - startTime > maxThinkTime) break;

    const score = alphaBeta(
      gameState,
      setIndex,
      move,
      depth - 1,
      -Infinity,
      Infinity,
      false,
      player
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Minimax algoritması
 */
function minimax(
  gameState: any,
  setIndex: number,
  moveIndex: number,
  depth: number,
  isMaximizing: boolean,
  originalPlayer: Player
): number {
  const currentSet = gameState.sets[setIndex];

  // Simüle edilmiş hamle
  const result = applyMove(gameState, moveIndex);

  if (depth === 0 || result.setFinished) {
    return evaluateBoard(result.board, originalPlayer);
  }

  const nextPlayer = result.nextPlayer;
  const validMoves = getValidMoves(
    { ...currentSet, board: result.board, currentPlayer: nextPlayer } as SetState,
    nextPlayer
  );

  if (validMoves.length === 0) {
    return evaluateBoard(result.board, originalPlayer);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const evaluation = minimax(
        { ...gameState, sets: [{ ...currentSet, board: result.board, currentPlayer: nextPlayer }] },
        0,
        move,
        depth - 1,
        false,
        originalPlayer
      );
      maxEval = Math.max(maxEval, evaluation);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const evaluation = minimax(
        { ...gameState, sets: [{ ...currentSet, board: result.board, currentPlayer: nextPlayer }] },
        0,
        move,
        depth - 1,
        true,
        originalPlayer
      );
      minEval = Math.min(minEval, evaluation);
    }
    return minEval;
  }
}

/**
 * Alpha-Beta Pruning
 */
function alphaBeta(
  gameState: any,
  setIndex: number,
  moveIndex: number,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  originalPlayer: Player
): number {
  const currentSet = gameState.sets[setIndex];

  // Simüle edilmiş hamle
  const result = applyMove(gameState, moveIndex);

  if (depth === 0 || result.setFinished) {
    return evaluateBoardAdvanced(result.board, originalPlayer);
  }

  const nextPlayer = result.nextPlayer;
  const validMoves = getValidMoves(
    { ...currentSet, board: result.board, currentPlayer: nextPlayer } as SetState,
    nextPlayer
  );

  if (validMoves.length === 0) {
    return evaluateBoardAdvanced(result.board, originalPlayer);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const evaluation = alphaBeta(
        { ...gameState, sets: [{ ...currentSet, board: result.board, currentPlayer: nextPlayer }] },
        0,
        move,
        depth - 1,
        alpha,
        beta,
        false,
        originalPlayer
      );
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Beta cut-off
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const evaluation = alphaBeta(
        { ...gameState, sets: [{ ...currentSet, board: result.board, currentPlayer: nextPlayer }] },
        0,
        move,
        depth - 1,
        alpha,
        beta,
        true,
        originalPlayer
      );
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha cut-off
    }
    return minEval;
  }
}

/**
 * Basit board değerlendirmesi
 */
function evaluateBoard(board: BoardState, player: Player): number {
  const playerTreasure = player === 'player1' ? 6 : 13;
  const opponentTreasure = player === 'player1' ? 13 : 6;

  return board.pits[playerTreasure] - board.pits[opponentTreasure];
}

/**
 * Gelişmiş board değerlendirmesi (Zor bot için)
 */
function evaluateBoardAdvanced(board: BoardState, player: Player): number {
  const playerTreasure = player === 'player1' ? 6 : 13;
  const opponentTreasure = player === 'player1' ? 13 : 6;

  const playerPits = player === 'player1' ? [0, 5] : [7, 12];
  const opponentPits = player === 'player1' ? [7, 12] : [0, 5];

  // Hazne farkı (en önemli)
  const treasureDiff = board.pits[playerTreasure] - board.pits[opponentTreasure];

  // Tahtadaki taş sayısı
  let playerBoardStones = 0;
  let opponentBoardStones = 0;

  for (let i = playerPits[0]; i <= playerPits[1]; i++) {
    playerBoardStones += board.pits[i];
  }

  for (let i = opponentPits[0]; i <= opponentPits[1]; i++) {
    opponentBoardStones += board.pits[i];
  }

  const boardDiff = playerBoardStones - opponentBoardStones;

  // Stratejik pozisyonlar (hazneye yakın kuyular daha değerli)
  let strategicValue = 0;
  const strategicIndices = player === 'player1' ? [4, 5] : [11, 12];

  for (const idx of strategicIndices) {
    strategicValue += board.pits[idx] * 2;
  }

  // Toplam skor
  return treasureDiff * 10 + boardDiff * 2 + strategicValue;
}
