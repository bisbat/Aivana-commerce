"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    console.log("Search for:", searchQuery);
  };

  return (
    <section className=" py-24 md:py-28 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-110 opacity-40"
      >
        <source
          src="./Purple_Gradient_Grain_Video_Generation.mp4"
          type="video/mp4"
        />
      </video>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Main Title with better spacing */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          ศูนย์รวมคอมโพแนนต์ Frontend
          <br />
          <span className="bg-gradient-to-r from-[#a78bfa] via-[#8a57fb] to-[#7c3aed] bg-clip-text text-transparent">
            สำหรับทุกโปรเจกต์
          </span>
        </h1>

        {/* Subtitle with better readability */}
        <p className="text-slate-300 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          ค้นหาและแปลงปัญหาคอมโพแนนต์ Frontend ที่พร้อมใช้งานสำหรับทุกโปรเจกต์
          <br />
          ไม่ว่าคุณจะเป็นนักพัฒนาหรือนักออกแบบ ที่สามารถซื้อขายได้อย่างรวดเร็ว
          <br />
          คุณภาพสูงที่ช่วยให้คุณสามารถเริ่มต้นการทำงานได้เร็ว
          และส่งมอบผลงานอย่างมืออาชีพ
        </p>

        {/* Search Bar with enhanced design */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8a57fb] via-[#a78bfa] to-[#8a57fb] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500" />

            {/* Search box */}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
      `}</style>
    </section>
  );
};
