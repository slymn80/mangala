/**
 * Mangala Oyun Motoru Test Dosyası
 * 23 maddelik kuralların doğru çalıştığını test eder
 */

import { describe, test, expect } from '@jest/globals';
import {
  initializeGame,
  applyMove,
  getValidMoves,
  updateGameScore,
  boardToString
} from '../src/engine/engine';
import type { GameState } from '../src/types/game.types';

describe('Mangala Oyun Motoru Testleri', () => {
  describe('Oyun Başlatma (KURAL 1-6)', () => {
    test('Oyun doğru başlatılmalı - 48 taş, her kuyuda 4', () => {
      const game = initializeGame({
        mode: 'pvp',
        player1Name: 'Test1',
        player2Name: 'Test2'
      });

      expect(game).toBeDefined();
      expect(game.sets).toHaveLength(1);

      const board = game.sets[0].board;

      // Her kuyuda 4 taş olmalı (0-5 ve 7-12)
      for (let i = 0; i < 6; i++) {
        expect(board.pits[i]).toBe(4);
      }
      for (let i = 7; i < 13; i++) {
        expect(board.pits[i]).toBe(4);
      }

      // Hazneler boş olmalı
      expect(board.pits[6]).toBe(0);
      expect(board.pits[13]).toBe(0);

      // Toplam 48 taş
      const total = board.pits.reduce((sum, stones) => sum + stones, 0);
      expect(total).toBe(48);
    });
  });

  describe('Geçerli Hamle Kontrolü', () => {
    test('Geçersiz hamle reddedilmeli - boş kuyu', () => {
      const game = initializeGame({
        mode: 'pvp',
        player1Name: 'Test1',
        player2Name: 'Test2',
        firstPlayer: 'player1'
      });

      // Kuyuyu boşalt
      game.sets[0].board.pits[0] = 0;

      const result = applyMove(game, 0);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Boş kuyu');
    });

    test('Geçersiz hamle reddedilmeli - rakip bölgesi', () => {
      const game = initializeGame({
        mode: 'pvp',
        player1Name: 'Test1',
        player2Name: 'Test2',
        firstPlayer: 'player1'
      });

      const result = applyMove(game, 7); // Player 2'nin kuyusu

      expect(result.success).toBe(false);
      expect(result.message).toContain('kendi bölgeniz');
    });
  });

  describe('Hamle Uygulama (KURAL 11-12)', () => {
    test('Taşlar saat tersi yönde dağıtılmalı', () => {
      const game = initializeGame({
        mode: 'pvp',
        player1Name: 'Test1',
        player2Name: 'Test2',
        firstPlayer: 'player1'
      });

      // 0. kuyudan hamle (4 taş var)
      const result = applyMove(game, 0);

      expect(result.success).toBe(true);

      // 0. kuyu boş olmalı
      expect(result.board.pits[0]).toBe(0);

      // 1, 2, 3, 4 kuyularında birer taş artmalı (4 taş dağıtıldı)
      expect(result.board.pits[1]).toBe(5);
      expect(result.board.pits[2]).toBe(5);
      expect(result.board.pits[3]).toBe(5);
      expect(result.board.pits[4]).toBe(5);
    });
  });

  describe('Ekstra Tur (KURAL 13)', () => {
    test('Son taş hazneye denk gelirse ekstra tur kazanılmalı', () => {
      const game = initializeGame({
        mode: 'pvp',
        player1Name: 'Test1',
        player2Name: 'Test2',
        firstPlayer: 'player1'
      });

      // 2. kuyudan hamle - 4 taş ile hazneye (2+4=6) ulaşır
      game.sets[0].board.pits[2] = 4;

      const result = applyMove(game, 2);

      expect(result.success).toBe(true);
      expect(result.extraTurn).toBe(true);
      expect(result.nextPlayer).toBe('player1'); // Aynı oyuncu devam eder
      expect(result.board.pits[6]).toBe(1); // Hazneye 1 taş eklenmiş olmalı
    });
  });

  describe('Çift Yapma ve Yakalama (KURAL 18)', () => {
    test('Rakip bölgesinde çift yapılırsa taşlar yakalanmalı', () => {
      const game = initializeGame({
        mode: 'pvp',
        player1Name: 'Test1',
        player2Name: 'Test2',
        firstPlayer: 'player1'
      });

      // Senaryoyu hazırla: Player 1, 5. kuyudan 7 taş oynarsa
      // 7 taş dağıtılırsa: 5→6(hazne)→7→8→9→10→11→12
      // 12. kuyuya 1 taş gelir, 12'de 5 taş vardı, toplam 6 (çift!)

      game.sets[0].board.pits[5] = 7;
      game.sets[0].board.pits[12] = 5;

      const result = applyMove(game, 5);

      expect(result.success).toBe(true);
      expect(result.capturedStones).toBe(6); // 12. kuyudaki 6 taş yakalanmalı
      expect(result.board.pits[12]).toBe(0); // 12. kuyu boşalmalı
    });
  });

  describe('Karşıdan Yakalama (KURAL 19)', () => {
    test('Kendi boş kuyuya son taş + karşı dolu → ikisini de yakala', () => {
      const game = initializeGame({
        mode: 'pvp',
        player1Name: 'Test1',
        player2Name: 'Test2',
        firstPlayer: 'player1'
      });

      // Senaryo: 0. kuyu boş, 12. kuyu (karşı taraf) dolu
      // 1. kuyudan 1 taş oynarsak 0. kuyuya gelir
      game.sets[0].board.pits[0] = 0;
      game.sets[0].board.pits[1] = 1;
      game.sets[0].board.pits[12] = 5;

      const result = applyMove(game, 1);

      expect(result.success).toBe(true);
      expect(result.capturedStones).toBe(6); // 1 (kendi) + 5 (karşı) = 6
      expect(result.board.pits[0]).toBe(0); // Boş kalmalı
      expect(result.board.pits[12]).toBe(0); // Karşı taraf boşalmalı
      expect(result.board.pits[6]).toBe(6); // Hazneye 6 taş eklenmiş olmalı
    });
  });

  describe('Set Bitişi (KURAL 20-21)', () => {
    test('Bir taraf boşaldığında set bitmeli', () => {
      const game = initializeGame({
        mode: 'pvp',
        player1Name: 'Test1',
        player2Name: 'Test2',
        firstPlayer: 'player1'
      });

      // Player 1'in tüm kuyularını boşalt
      for (let i = 0; i < 6; i++) {
        game.sets[0].board.pits[i] = 0;
      }

      // Son kuyuya 1 taş koy
      game.sets[0].board.pits[5] = 1;

      const result = applyMove(game, 5);

      expect(result.success).toBe(true);
      expect(result.setFinished).toBe(true);
      expect(result.setWinner).toBeDefined();
    });
  });

  describe('Oyun Skoru (KURAL 22-23)', () => {
    test('5 set oynanmalı ve skor doğru hesaplanmalı', () => {
      const game = initializeGame({
        mode: 'pvp',
        player1Name: 'Test1',
        player2Name: 'Test2'
      });

      expect(game.sets).toHaveLength(1);
      expect(game.scores.player1).toBe(0);
      expect(game.scores.player2).toBe(0);

      // Player 1 kazanır
      let updatedGame = updateGameScore(game, 'player1');
      expect(updatedGame.scores.player1).toBe(1);
      expect(updatedGame.sets).toHaveLength(2);

      // Player 2 kazanır
      updatedGame = updateGameScore(updatedGame, 'player2');
      expect(updatedGame.scores.player2).toBe(1);

      // Berabere
      updatedGame = updateGameScore(updatedGame, 'draw');
      expect(updatedGame.scores.player1).toBe(1.5);
      expect(updatedGame.scores.player2).toBe(1.5);

      // 4. ve 5. setler
      updatedGame = updateGameScore(updatedGame, 'player1');
      updatedGame = updateGameScore(updatedGame, 'player1');

      expect(updatedGame.sets).toHaveLength(5);
      expect(updatedGame.status).toBe('finished');
      expect(updatedGame.winner).toBe('player1');
    });
  });

  describe('Geçerli Hamle Listesi', () => {
    test('Sadece dolu kuyular geçerli hamle olmalı', () => {
      const game = initializeGame({
        mode: 'pvp',
        player1Name: 'Test1',
        player2Name: 'Test2',
        firstPlayer: 'player1'
      });

      const set = game.sets[0];

      // Player 1'in bazı kuyularını boşalt
      set.board.pits[0] = 0;
      set.board.pits[2] = 0;

      const validMoves = getValidMoves(set, 'player1');

      expect(validMoves).toContain(1);
      expect(validMoves).toContain(3);
      expect(validMoves).toContain(4);
      expect(validMoves).toContain(5);
      expect(validMoves).not.toContain(0);
      expect(validMoves).not.toContain(2);
    });
  });
});
