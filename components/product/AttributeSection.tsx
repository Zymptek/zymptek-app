import React from 'react';

interface AttributeSectionProps {
  title: string;
  attributes: Record<string, string>[] | Record<string, any>;
}

const AttributeSection: React.FC<AttributeSectionProps> = ({
  title,
  attributes,
}) => {
  const renderSpecifications = (specs: Record<string, string>[]) => (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="bg-gray-100 text-left p-2 border border-gray-300">Attribute</th>
          <th className="bg-gray-100 text-left p-2 border border-gray-300">Value</th>
        </tr>
      </thead>
      <tbody>
        {specs.map((spec, index) => (
          <tr key={index}>
            <td className="p-2 border border-gray-300 font-medium capitalize">{spec.name.replace(/_/g, ' ')}</td>
            <td className="p-2 border border-gray-300 text-brand-200 font-semibold">{spec.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderPackagingAndDelivery = (data: Record<string, any>) => (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="bg-gray-100 text-left p-2 border border-gray-300">Attribute</th>
          <th className="bg-gray-100 text-left p-2 border border-gray-300">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 border border-gray-300 font-medium">Size</td>
          <td className="p-2 border border-gray-300 text-brand-200 font-semibold">
            {`${data.size.width} x ${data.size.height} x ${data.size.length} ${data.size.unit}`}
          </td>
        </tr>
        <tr>
          <td className="p-2 border border-gray-300 font-medium">Unit</td>
          <td className="p-2 border border-gray-300 text-brand-200 font-semibold">{data.unit}</td>
        </tr>
        <tr>
          <td className="p-2 border border-gray-300 font-medium">Weight</td>
          <td className="p-2 border border-gray-300 text-brand-200 font-semibold">
            {`${data.weight.value} ${data.weight.unit}`}
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative">
      <div className="bg-gradient-brand p-4">
        <h3 className="text-xl font-bold text-text-dark">{title}</h3>
      </div>
      <div className="p-4">
        {Array.isArray(attributes) ? (
          attributes.length > 0 ? renderSpecifications(attributes) : <p className="text-gray-600">No data available.</p>
        ) : (
          Object.keys(attributes).length > 0 ? renderPackagingAndDelivery(attributes) : <p className="text-gray-600">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default AttributeSection;