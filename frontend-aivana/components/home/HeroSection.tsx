'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ProductDataForm } from '@/lib/api/types/product';

export const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // TODO: Implement search functionality
  };

  const a: ProductDataForm = {
    productType: '',
    file: null,
    keywords: '',
    productName: '',
    category: '',
    features: [],
    price: '',
    heroImage: null,
    detailImages: []
  }

  return (
    <section className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          ศูนย์รวมคอมโพแนนต์ Frontend สำหรับทุกโปรเจกต์
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
          ค้นหาและแปลงปัญหาคอมโพแนนต์ Frontend ที่พร้อมใช้งานสำหรับทุกโปรเจกต์
          ไม่ว่าคุณจะเป็นนักพัฒนาหรือนักออกแบบ ที่สามารถซื้อขายได้อย่างรวดเร็ว
          คุณภาพสูงที่ช่วยให้คุณสามารถเริ่มต้นการทำงานได้เร็ว และส่งมอบผลงานอย่างมืออาชีพ
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหา UI Kits, เทมเพลต, เอลิเมนต์ ฯ"
              className="w-full px-6 py-4 pr-12 bg-[#0f1729] border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};