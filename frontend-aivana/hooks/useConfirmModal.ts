'use client';
import { useState } from 'react';

export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [callback, setCallback] = useState<() => void>(() => {});

  const open = (onConfirm: () => void) => {
    setCallback(() => onConfirm);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    callback,
  };
}
