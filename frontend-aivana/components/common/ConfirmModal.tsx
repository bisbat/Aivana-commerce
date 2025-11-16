'use client';
import { motion } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-linne-purple-hover p-6 rounded-xl shadow-xl max-w-sm w-full text-white bg-purple-800"
      >
        <h2 className="text-xl font-bold mb-3 text-primary">{title}</h2>
        <p className="mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded hover:text-gray-300"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
