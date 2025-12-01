import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[] | string[];
  placeholder?: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false
}) => {
  // Check if options is array of objects or strings
  const isObjectArray = options.length > 0 && typeof options[0] === 'object';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {isObjectArray
          ? (options as SelectOption[]).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : (options as string[]).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
      </select>
    </div>
  );
};