"use client";

import React, { useEffect, useRef } from "react";

export const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden -mt-[160px] pt-[160px]">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover scale-110 opacity-40 -z-10"
        onLoadedData={(e) => {
          e.currentTarget.play().catch(() => { });
        }}
      >
        <source
          src={`${BASE_PATH}/Purple_Gradient_Grain_Hero_Section.mp4`}
          type="video/mp4"
        />
      </video>
      {/* Fallback Background - แสดงเมื่อวิดีโอโหลดไม่ได้ */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 opacity-50 -z-20" />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24 md:py-28">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          ศูนย์รวมคอมโพแนนต์ Frontend
          <br />
          <span className="bg-gradient-to-r from-[#a78bfa] via-[#8a57fb] to-[#7c3aed] bg-clip-text text-transparent">
            สำหรับทุกโปรเจกต์
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          ค้นหาและแปลงปัญหาคอมโพแนนต์ Frontend ที่พร้อมใช้งานสำหรับทุกโปรเจกต์
          <br />
          ไม่ว่าคุณจะเป็นนักพัฒนาหรือนักออกแบบ ที่สามารถซื้อขายได้อย่างรวดเร็ว
          <br />
          คุณภาพสูงที่ช่วยให้คุณสามารถเริ่มต้นการทำงานได้เร็ว
          และส่งมอบผลงานอย่างมืออาชีพ
        </p>
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
