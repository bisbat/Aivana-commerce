"use client";

import React from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { useEffect } from "react";

const features = [
  {
    title: "คุณภาพสูง",
    desc: "คอมโพแนนต์ที่ผ่านการตรวจสอบและสร้างโดยผู้เชี่ยวชาญ",
    bg: "bg-gradient-to-br from-[#5B4BA8]/20 to-[#534AB7]/10",
  },
  {
    title: "ประสิทธิภาพ",
    desc: "โซลูชันที่เร็ว ปลอดภัย และเหมาะสมสำหรับการใช้งานจริง",
    bg: "bg-gradient-to-br from-[#534AB7]/15 to-[#7B5BA8]/10",
  },
  {
    title: "ง่ายต่อการใช้",
    desc: "ดัดแปลง ปรับแต่ง และรวมเข้ากับโปรเจกต์ของคุณได้ง่ายดาย",
    bg: "bg-gradient-to-br from-[#8A7BB0]/15 to-[#5B4BA8]/10",
  },
  {
    title: "รองรับ Framework หลากหลาย",
    desc: "ส่วนประกอบที่ใช้ได้กับ React, Vue, Angular และ Framework อื่นๆ",
    bg: "bg-gradient-to-br from-[#6B5BA0]/15 to-[#4B3B98]/10",
  },
  {
    title: "เอกสารครบถ้วน",
    desc: "เอกสารและแนวทางการใช้งานที่ชัดเจนและเข้าใจง่าย",
    bg: "bg-gradient-to-br from-[#534AB7]/15 to-[#7B5BA8]/10",
  },
  {
    title: "อัปเดตสม่ำเสมอ",
    desc: "คอมโพแนนต์และเทมเพลตใหม่ๆ ได้รับการเพิ่มเติมอย่างต่อเนื่อง",
    bg: "bg-gradient-to-br from-[#8A7BB0]/15 to-[#5B4BA8]/10",
  },
];

export default function AboutPage() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setUserRole(user?.role || null);
    };

    checkAuth();
  }, []);

  return (
    <main className="bg-[var(--color-background)] min-h-screen text-[#EEEDF5]">
      {/* Hero */}
      <section className="border-b border-white/[0.07]">
        <div className="max-w-[1400px] mx-auto px-4 py-28 relative overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#534AB7]/10 blur-3xl pointer-events-none" />
          <p className="text-[11px] tracking-[0.18em] uppercase text-purple-400 mb-8 font-normal">
            Template & Component Marketplace
          </p>
          <h1 className="font-serif text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] italic text-[#EEEDF5] mb-6">
            We are
            <br />
            <span className="text-[#A89FF0]">AIVANA.</span>
          </h1>
          <p className="text-[#7B7A8E] text-lg max-w-xl leading-relaxed font-light">
            ศูนย์รวม Template & Component —
            พร้อมให้คุณหยิบใช้และต่อยอดในโปรเจกต์ของคุณได้ทันที
          </p>
        </div>
      </section>

      {/* About */}
      <section className="border-b border-white/[0.07]">
        <div className="max-w-[1400px] mx-auto px-4 py-20 ">
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#7B7A8E] mb-8 font-normal">
              เกี่ยวกับเรา
            </p>
            <div className="text-[#7B7A8E] text-lg leading-relaxed font-light space-y-5">
              <p>
                AIVANA เป็นแพลตฟอร์มที่ออกแบบมาเพื่อให้ผู้พัฒนา ผู้ออกแบบ
                และทีมงานสามารถค้นหา แชร์ และใช้งาน UI Kit, Frontend Template
                และ Backend Template ที่มีคุณภาพสูง
              </p>
              <p>
                เราเชื่อว่าการแชร์ความรู้และองค์ประกอบการออกแบบที่เป็นประโยชน์
                สามารถช่วยเพิ่มประสิทธิภาพในการพัฒนาโปรเจกต์ได้เป็นอย่างมาก
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-white/[0.07]">
        <div className="max-w-[1400px] mx-auto px-4 py-20">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#7B7A8E] mb-10 font-normal">
            ทำไมต้องเลือก AIVANA
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-white/[0.07] bg-[#262549] hover:bg-[#1e1b3d] hover:border-white/[0.12] transition-all duration-200"
              >
                <div className="text-[#EEEDF5] text-sm font-medium mb-2 tracking-tight">
                  {f.title}
                </div>
                <div className="text-[#7B7A8E] text-xs leading-relaxed font-light">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-white/[0.07]">
        <div className="max-w-[1400px] mx-auto px-4 py-20">
          <div className="bg-[#262549] border border-white/[0.07] rounded-2xl p-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <h2 className="font-serif text-4xl italic text-[#EEEDF5] leading-snug">
                พร้อมที่จะ
                <br />
                <em className="text-[#A89FF0]">เริ่มต้น</em>แล้วหรือยัง?
              </h2>
              <p className="text-[#7B7A8E] text-base mt-4 leading-relaxed font-light max-w-md">
                เริ่มต้นโปรเจกต์ได้เร็วขึ้น ด้วย Template และ Component <br />
                คุณภาพสูงที่พร้อมให้คุณหยิบใช้ได้ทันที
              </p>
            </div>
            <div className="flex flex-col gap-3 items-start md:items-end">
              <Link
                href="/products"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium tracking-wide px-7 py-3 rounded-xl transition-colors duration-200 whitespace-nowrap"
              >
                สำรวจคอมโพแนนต์
              </Link>
              {userRole === "customer" && (
                <Link
                  href="/seller/become"
                  className="border border-white/30 hover:border-white/60 text-white/70 hover:text-white text-sm px-7 py-3 rounded-xl transition-colors duration-200 whitespace-nowrap"
                >
                  เป็นผู้ขาย →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <Footer />
    </main>
  );
}
