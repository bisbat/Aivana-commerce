'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[var(--linne-purple)] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[var(--primary)]">AIVANA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/categories" 
              className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
            >
              หมวดหมู่
            </Link>
            <Link 
              href="/about" 
              className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
            >
              เกี่ยวกับ
            </Link>
            <button className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
              <Search size={20} />
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/cart" 
              className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
            >
              <ShoppingCart size={20} />
            </Link>
            <Link 
              href="/profile" 
              className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
            >
              <User size={20} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[var(--foreground)]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--linne-purple)] border-t border-slate-800">
          <div className="px-4 py-4 space-y-3">
            <Link href="/categories" className="block text-[var(--foreground)] hover:text-[var(--primary)]">
              หมวดหมู่
            </Link>
            <Link href="/about" className="block text-[var(--foreground)] hover:text-[var(--primary)]">
              เกี่ยวกับ
            </Link>
            <Link href="/cart" className="block text-[var(--foreground)] hover:text-[var(--primary)]">
              ตะกร้า
            </Link>
            <Link href="/profile" className="block text-[var(--foreground)] hover:text-[var(--primary)]">
              โปรไฟล์
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};