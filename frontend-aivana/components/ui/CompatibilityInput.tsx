import React from 'react';

interface CompatibilityInputProps {
  compatibility: string[];
  onChange: (compatibility: string[]) => void;
  maxItems?: number;
}

export const CompatibilityInput: React.FC<CompatibilityInputProps> = ({
  compatibility,
  onChange,
  maxItems = 6
}) => {
  // Update a specific compatibility item
  const updateItem = (index: number, value: string) => {
    const next = [...compatibility];
    next[index] = value;
    onChange(next);
  };

  // Prepare visible slots (fill with empty strings for unused slots)
  const slots = Array.from({ length: maxItems }, (_, i) => compatibility[i] || '');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        Compatibility (max {maxItems})
      </label>

      <div className="grid grid-cols-2 gap-3">
        {slots.map((item, index) => (
          <input
            key={index}
            type="text"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`Compatibility ${index + 1}`}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
        ))}
      </div>
    </div>
  );
};
