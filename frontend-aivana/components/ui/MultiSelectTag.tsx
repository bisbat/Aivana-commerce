'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Tag } from '@/lib/types/tag';

interface MultiSelectTagProps {
  label: string;
  tags: Tag[];
  selectedTagIds: number[];
  onChange: (selectedIds: number[]) => void;
  required?: boolean;
}

export const MultiSelectTag: React.FC<MultiSelectTagProps> = ({
  label,
  tags,
  selectedTagIds,
  onChange,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      // Remove tag
      onChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      // Add tag
      onChange([...selectedTagIds, tagId]);
    }
  };

  const selectedTags = tags.filter(tag => selectedTagIds.includes(Number(tag.id)));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => toggleTag(Number(tag.id))}
                className="hover:bg-purple-700 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-left focus:outline-none focus:border-purple-500 hover:bg-slate-700 transition-colors"
        >
          {selectedTags.length === 0 ? 'Select tags...' : `${selectedTags.length} tag(s) selected`}
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute z-20 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(Number(tag.id));
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(Number(tag.id))}
                    className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center justify-between"
                  >
                    <span className="text-white">{tag.name}</span>
                    {isSelected && <Check size={16} className="text-purple-400" />}
                  </button>
                );
              })}
              {tags.length === 0 && (
                <div className="px-4 py-2 text-slate-400 text-sm">
                  No tags available
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};