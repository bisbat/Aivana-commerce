'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { ProfileModal } from './ProfileModal';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <nav className="bg-[var(--background)] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo + Menu Items + Search */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="font-family text-2xl font-bold text-[var(--primary)]">AIVANA</span>
            </Link>

            {/* Desktop Navigation - Moved to left */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/categories" 
                className="text-white hover:text-[var(--primary)] transition-colors text-sm"
              >
                หมวดหมู่
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-[var(--primary)] transition-colors text-sm"
              >
                เกี่ยวกับ
              </Link>
              <button className="text-white hover:text-[var(--primary)] transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/cart" 
              className="text-white hover:text-[var(--primary)] transition-colors"
            >
              <ShoppingCart size={20} />
            </Link>
            
            {/* Profile Icon with Modal */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-white hover:text-[var(--primary)] transition-colors"
              >
                <User size={20} />
              </button>

              {/* Profile Modal */}
              <ProfileModal 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--linne-purple-hover)] border-t border-slate-800">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/categories" 
              className="block text-white hover:text-[var(--primary)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              หมวดหมู่
            </Link>
            <Link 
              href="/about" 
              className="block text-white hover:text-[var(--primary)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              เกี่ยวกับ
            </Link>
            <Link 
              href="/cart" 
              className="block text-white hover:text-[var(--primary)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ตะกร้า
            </Link>
            <Link 
              href="/profile" 
              className="block text-white hover:text-[var(--primary)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              โปรไฟล์
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};