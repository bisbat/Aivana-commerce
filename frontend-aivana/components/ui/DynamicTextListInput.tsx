interface DynamicTextListInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  required?: boolean;
}

export function DynamicTextListInput({
  label,
  value,
  onChange,
  placeholder = "Enter value",
  maxItems = 6,
  required = false,
}: DynamicTextListInputProps) {
  const handleChange = (index: number, newValue: string) => {
    const next = [...value];
    next[index] = newValue;
    onChange(next);
  };

  const addItem = () => {
    if (value.length >= maxItems) return;
    onChange([...value, ""]);
  };

  const removeItem = (index: number) => {
    if (value.length <= 1) return;
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-white text-sm mb-2">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleChange(index, e.target.value)
              }
              placeholder={placeholder}
              className="flex-1 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 focus:border-purple-500 text-white placeholder:text-slate-400 focus:outline-none transition-colors"
            />

            {value.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                ลบ
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          disabled={value.length >= maxItems}
          className="w-full px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 rounded-lg border border-dashed border-slate-700 transition-colors disabled:opacity-50"
        >
          + เพิ่ม ({value.length}/{maxItems})
        </button>
      </div>
    </div>
  );
}
