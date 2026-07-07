'use client';

// ============================================================
// useToast — Toast Notification State Management
// ============================================================

import { useState, useCallback } from 'react';
import type { Toast, ToastType } from '@/types';
import { TOAST_DURATION } from '@/utils/constants';

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = TOAST_DURATION) => {
      const id = `toast-${++toastIdCounter}`;
      const toast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      // Auto-remove after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (msg: string) => addToast(msg, 'success'),
    [addToast]
  );
  const error = useCallback(
    (msg: string) => addToast(msg, 'error'),
    [addToast]
  );
  const warning = useCallback(
    (msg: string) => addToast(msg, 'warning'),
    [addToast]
  );
  const info = useCallback(
    (msg: string) => addToast(msg, 'info'),
    [addToast]
  );

  return { toasts, addToast, removeToast, success, error, warning, info };
}
