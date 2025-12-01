import React from 'react';

interface InputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    type?: 'text' | 'number' | 'url';
}

export const Input: React.FC<InputProps> = ({
    label,
    value,
    onChange,
    placeholder = '',
    required = false,
    type = 'text'
}) => {
    return (
        <div className="space-y-2">
            {/* Label */}
            <label className="block text-sm font-medium text-white">
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>

            {/* Input field */}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
        </div>
    );
}
