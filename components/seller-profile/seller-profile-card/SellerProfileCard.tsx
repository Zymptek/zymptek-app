"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditDialog } from '../EditableDialog';
import { z } from 'zod';
import { Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldProps } from '@/app/(protected)/seller/[sellerId]/page';
import { useAuth } from '@/context/AuthContext';

type ProfileSectionProps = {
  isAuthUser: boolean;
  title: string;
  id: string;
  sellerId: string;
  data?: Record<string, any>;
  fieldConfig: Record<string, FieldProps>;
  schema: z.ZodObject<any>;
  onSubmit: (data: any) => void;
};

export const SellerProfileCards = ({ isAuthUser, title, id, sellerId, data, fieldConfig, schema, onSubmit }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSubmit = (updatedData: any) => {
    onSubmit(updatedData);
    setIsEditing(false);
  };

  const handleAddSection = () => {
    setIsEditing(true);
  };

  if (!data) {
    return (
      <Card className="mb-8 relative" id={id}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-brand-200">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            {
              isAuthUser ?
              <Button onClick={handleAddSection} className="flex items-center gap-2 btn-primary">
              <Plus size={16} />
              Add Section
            </Button>
              :
              <div className="col-span-2 text-center text-gray-500">
              No {title.toLowerCase()} data available
            </div>
            }
            
          </div>
        </CardContent>
        {isEditing && (
          <EditDialog
            name={title}
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            defaultValues={{}}
            schema={schema}
            onSubmit={handleEditSubmit}
            fieldConfig={fieldConfig}
          />
        )}
      </Card>
    );
  }

  return (
    <Card className="mb-8 relative" id={id}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand-200">{title}</CardTitle>
        {
              isAuthUser ?
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 text-brand-100 hover:text-brand-700"
        >
          <Edit />
        </button>
        : <></>}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(data).map(([key, value]) => (
            value && (
              <div key={key}>
                <h3 className="font-semibold text-brand-300">{fieldConfig[key].name}</h3>
                {/* Check if the value is an array, a date, or just a regular value */}
                <p>
                  {Array.isArray(value)
                    ? value.join(', ')
                    : value instanceof Date
                      ? value.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : typeof value === 'string' && !isNaN(Date.parse(value))
                        ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : value}
                </p>
              </div>
            )
          ))}

          {Object.keys(data).length === 0 && (
            <div className="col-span-2 text-center text-gray-500">
              No {title.toLowerCase()} data available
            </div>
          )}
        </div>
      </CardContent>

      {isEditing && (
        <EditDialog
          name={title}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          defaultValues={data}
          schema={schema}
          onSubmit={handleEditSubmit}
          fieldConfig={fieldConfig}
        />
      )}
    </Card>
  );
};