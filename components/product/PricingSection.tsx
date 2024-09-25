import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PricingSectionProps {
  pricing: Record<string, number>;
}

const PricingSection: React.FC<PricingSectionProps> = ({ pricing }) => {
  return (
    <div className="bg-white rounded-lg p-5 border-l-4 border-brand-200 relative space-y-8 shadow-xl ">
      <div className="flex justify-between items-center mb-4">
        <h3 className='text-2xl font-semibold text-brand-300'>Pricing</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(pricing).map(([range, price]) => (
          <Card key={range} className="bg-gray-50 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <h4 className="text-lg font-semibold text-brand-200 mb-2">{range}</h4>
              <p className="text-2xl font-bold">${typeof price === 'number' ? price.toFixed(2) : price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingSection;