/**
 * Mesaj Bildirimi Bileşeni
 * Oyun mesajlarını gösterir
 */

import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

const MessageToast: React.FC = () => {
  const message = useGameStore((state) => state.message);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [message]);

  if (!show || !message) return null;

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 slide-up">
      <div className="glass px-6 py-4 rounded-2xl shadow-2xl border-2 border-yellow-400">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💬</span>
          <p className="text-lg font-semibold text-gray-900 dark:text-white drop-shadow-lg">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageToast;
