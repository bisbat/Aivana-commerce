"use client";
export default function BackgroundAivana() {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-center items-center gap-0 opacity-[0.01] overflow-hidden">
      {Array.from({ length: 10 }).map((_, index) => (
        <span
          key={index}
          className="font-bold text-white whitespace-nowrap leading-none"
          style={{ fontSize: "20rem", lineHeight: "0.9" }}
        >
          AIVANA
        </span>
      ))}
    </div>
  );
}
