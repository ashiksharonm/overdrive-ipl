import { useState, useCallback, useEffect } from 'react';

interface MomentumState {
  streak: number;
  multiplier: number;
  showConfetti: boolean;
}

export function useMomentum() {
  const [state, setState] = useState<MomentumState>({
    streak: 0,
    multiplier: 1,
    showConfetti: false,
  });

  const recordPrediction = useCallback((isCorrect: boolean) => {
    setState((prev) => {
      if (isCorrect) {
        const newStreak = prev.streak + 1;
        // Apply 2x multiplier if streak is 3 or more
        const newMultiplier = newStreak >= 3 ? 2 : 1;
        // Trigger confetti exactly when hitting the streak of 3
        const triggerConfetti = newStreak === 3;

        return {
          streak: newStreak,
          multiplier: newMultiplier,
          showConfetti: triggerConfetti || prev.showConfetti,
        };
      } else {
        // Reset streak on incorrect prediction
        return {
          streak: 0,
          multiplier: 1,
          showConfetti: false,
        };
      }
    });
  }, []);

  const resetConfetti = useCallback(() => {
    setState((prev) => ({ ...prev, showConfetti: false }));
  }, []);

  // Auto-hide confetti after 3 seconds
  useEffect(() => {
    if (state.showConfetti) {
      const timer = setTimeout(() => {
        resetConfetti();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.showConfetti, resetConfetti]);

  return {
    ...state,
    recordPrediction,
    resetConfetti,
  };
}
