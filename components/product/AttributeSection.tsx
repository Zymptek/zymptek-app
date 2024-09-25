import React from 'react';

interface AttributeSectionProps {
  title: string;
  attributes: Record<string, string | string[]>;
}

const AttributeSection: React.FC<AttributeSectionProps> = ({
  title,
  attributes,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative">
      <div className="bg-gradient-brand p-4">
        <h3 className="text-xl font-bold text-text-dark">{title}</h3>
      </div>
      <div className="p-4">
        {Object.keys(attributes).length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-100 text-left p-2 border border-gray-300">Attribute</th>
                <th className="bg-gray-100 text-left p-2 border border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(attributes).map(([key, value]) => (
                <tr key={key}>
                  <td className="p-2 border border-gray-300 font-medium capitalize">{key.replace(/_/g, ' ')}</td>
                  <td className="p-2 border border-gray-300 text-brand-200 font-semibold">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default AttributeSection;