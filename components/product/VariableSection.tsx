import React from 'react';

interface VariationsSectionProps {
  variations: {name: string, options: string[]}[];
}

const VariationsSection: React.FC<VariationsSectionProps> = ({ variations }) => {
  return (
    <div className='bg-white rounded-lg p-6 border-l-4 border-brand-200 space-y-6 shadow-xl'>
      <h3 className='text-2xl font-semibold text-brand-300 mb-4'>Variations</h3>
      <div className="space-y-6">
        {variations.map((variation, index) => (
          <div key={index} className="border-b border-brand-100 pb-4 last:border-b-0 last:pb-0">
            <span className="font-medium capitalize block mb-3 text-brand-300">{variation.name.replace(/_/g, ' ')}:</span>
            <div className="flex flex-wrap gap-3">
              {variation.options.map((item, index) => 
                variation.name.toLowerCase() === 'color' ? (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full border-2 border-brand-100 shadow-md"
                    style={{ backgroundColor: item }}
                    title={item}
                  />
                ) : (
                  <div
                    key={index}
                    className="px-4 py-2 bg-brand-50 text-brand-300 rounded-md border border-brand-100 hover:bg-brand-100 hover:text-text-dark transition-colors duration-200"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariationsSection;