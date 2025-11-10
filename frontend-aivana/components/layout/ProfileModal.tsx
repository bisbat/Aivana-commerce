'use client';

import React from 'react';
import Link from 'next/link';
import { User, Store, Settings, LogOut } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock user data - later replace with real auth
const mockUser = {
  name: 'BISBAT CARROT',
  email: 'bisbatlovecarrot@gmail.com',
  avatar: null, // No avatar image
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logging out...');
    onClose();
  };

  return (
    <>
      {/* Backdrop - Click to close */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--linne-purple)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
        {/* Profile Section */}
        <div className="p-6 text-center border-b border-slate-600">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[var(--background)] border-2 border-slate-500 flex items-center justify-center">
            {mockUser.avatar ? (
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={48} className="text-slate-300" />
            )}
          </div>

          {/* User Info */}
          <h3 className="text-xl font-bold text-white mb-1">
            {mockUser.name}
          </h3>
          <p className="text-sm text-slate-300">
            {mockUser.email}
          </p>
        </div>

        {/* Navigation Menu */}
        <div className="py-2">
          {/* โปรไฟล์ของฉัน */}
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-6 py-3 text-white text-[var(--primary)] transition-colors"
          >
            <User size={20} />
            <span>โปรไฟล์ของฉัน</span>
          </Link>

          {/* ร้านของฉัน */}
          <Link
            href="/stores"
            onClick={onClose}
            className="flex items-center gap-3 px-6 py-3 text-white text-[var(--primary)] transition-colors"
          >
            <Store size={20} />
            <span>ร้านของฉัน</span>
          </Link>

          {/* ตั้งค่า */}
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-6 py-3 text-white text-[var(--primary)] transition-colors"
          >
            <Settings size={20} />
            <span>ตั้งค่า</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-600 mx-4" />

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#4a4668] rounded-xl font-medium transition-all"
          >
            <LogOut size={20} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </>
  );
};