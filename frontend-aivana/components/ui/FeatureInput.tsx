import React from 'react';

interface FeatureInputProps {
  features: string[];
  onChange: (features: string[]) => void;
  maxFeatures?: number;
}

export const FeatureInput: React.FC<FeatureInputProps> = ({
  features,
  onChange,
  maxFeatures = 6
}) => {
  // Update a specific feature
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    onChange(newFeatures);
  };

  // Create empty feature slots
  const featureSlots = Array.from({ length: maxFeatures }, (_, i) => features[i] || '');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        Features (max {maxFeatures})
      </label>

      <div className="grid grid-cols-2 gap-3">
        {featureSlots.map((feature, index) => (
          <input
            key={index}
            type="text"
            value={feature}
            onChange={(e) => updateFeature(index, e.target.value)}
            placeholder={`Feature ${index + 1}`}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
        ))}
      </div>
    </div>
  );
};