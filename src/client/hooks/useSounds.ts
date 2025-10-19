/**
 * Ses Efektleri Hook
 * Oyun ses efektlerini yönetir
 */

import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

type SoundType = 'move' | 'capture' | 'extraTurn' | 'setWin' | 'gameWin' | 'click';

export const useSounds = () => {
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const volume = useGameStore((state) => state.volume);

  const soundsRef = useRef<{ [key in SoundType]?: HTMLAudioElement }>({});

  // Sesleri yükle
  useEffect(() => {
    soundsRef.current = {
      move: new Audio('/assets/sounds/ui-pop-up-243471.mp3'),
      capture: new Audio('/assets/sounds/clear-combo-4-394493.mp3'),
      extraTurn: new Audio('/assets/sounds/combine-special-394482.mp3'),
      setWin: new Audio('/assets/sounds/level-complete-394515.mp3'),
      gameWin: new Audio('/assets/sounds/applause-cheer-236786.mp3'),
      click: new Audio('/assets/sounds/clear-combo-8-394509.mp3'),
    };

    // Tüm sesleri preload et
    Object.values(soundsRef.current).forEach((audio) => {
      if (audio) {
        audio.preload = 'auto';
      }
    });
  }, []);

  // Volume değiştiğinde güncelle
  useEffect(() => {
    Object.values(soundsRef.current).forEach((audio) => {
      if (audio) {
        audio.volume = volume / 100;
      }
    });
  }, [volume]);

  const playSound = useCallback(
    (soundType: SoundType) => {
      if (!soundEnabled) return;

      const audio = soundsRef.current[soundType];
      if (audio) {
        // Eğer ses çalıyorsa, başa sar
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.warn('Ses çalınamadı:', error);
        });
      }
    },
    [soundEnabled]
  );

  return { playSound };
};
