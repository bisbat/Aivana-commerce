import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f1729] border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-purple-500 mb-4">AIVANA</h3>
            <p className="text-slate-400 text-sm">
              ศูนย์รวมคอมโพแนนต์ Frontend สำหรับทุกโปรเจกต์
            </p>
          </div>

          {/* หมวดหมู่ */}
          <div>
            <h4 className="text-white font-semibold mb-4">หมวดหมู่</h4>
            <ul className="space-y-2">
              {['UI Kits', 'UI Kits', 'UI Kits', 'UI Kits'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-slate-400 hover:text-purple-400 text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ร่วมงานกับเรา */}
          <div>
            <h4 className="text-white font-semibold mb-4">ร่วมงานกับเรา</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-slate-400 hover:text-purple-400 text-sm transition-colors">
                  สมัครเป็นนักขาย
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 AIVANA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};