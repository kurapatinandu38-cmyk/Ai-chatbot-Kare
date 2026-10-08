import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSessionTimeoutOptions {
  timeoutSeconds?: number;
  warningSeconds?: number;
  isLoggedIn: boolean;
  userLabel?: string;
  onTimeout: () => void;
}

export function useSessionTimeout({
  timeoutSeconds = 15 * 60,
  warningSeconds = 60,
  isLoggedIn,
  userLabel = 'User',
  onTimeout
}: UseSessionTimeoutOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState(timeoutSeconds);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const resetTimer = useCallback(() => {
    setRemainingSeconds(timeoutSeconds);
    setIsWarningVisible(false);
  }, [timeoutSeconds]);

  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const logoutImmediately = useCallback(() => {
    setIsWarningVisible(false);
    onTimeoutRef.current();
  }, []);

  // Listen for user activity to automatically refresh session time while active
  useEffect(() => {
    if (!isLoggedIn) {
      setRemainingSeconds(timeoutSeconds);
      setIsWarningVisible(false);
      return;
    }

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    let lastActivity = Date.now();

    const handleActivity = () => {
      // Throttle activity reset to at most once per 10 seconds to avoid unnecessary renders
      const now = Date.now();
      if (now - lastActivity > 10000) {
        lastActivity = now;
        // Only reset if not already in final warning period
        setRemainingSeconds(prev => {
          if (prev > warningSeconds) {
            return timeoutSeconds;
          }
          return prev;
        });
      }
    };

    activityEvents.forEach(evt => window.addEventListener(evt, handleActivity, { passive: true }));

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsWarningVisible(false);
          onTimeoutRef.current();
          return 0;
        }
        const next = prev - 1;
        if (next <= warningSeconds) {
          setIsWarningVisible(true);
        }
        return next;
      });
    }, 1000);

    return () => {
      activityEvents.forEach(evt => window.removeEventListener(evt, handleActivity));
      clearInterval(interval);
    };
  }, [isLoggedIn, timeoutSeconds, warningSeconds]);

  return {
    remainingSeconds,
    isWarningVisible,
    extendSession,
    logoutImmediately,
    resetTimer
  };
}
