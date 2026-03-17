export default function LoadingDots() {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-500">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      กำลังแนะนำสินค้า...
    </div>
  );
}