const DEFAULT_WIDTHS = [140, 100, 110, 100, 120];

export default function SkeletonRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      {Array.from({ length: columns }, (_, i) => (
        <td key={i} style={{ padding: "16px 20px" }}>
          <span
            style={{
              display: "inline-block",
              width: DEFAULT_WIDTHS[i] ?? 100,
              height: 14,
              borderRadius: 6,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
        </td>
      ))}
    </tr>
  );
}