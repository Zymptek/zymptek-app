"use client";

import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useToast } from '@/hooks/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductEditorProps {
  initialValue: string;
  productId: string;
  isOwner: boolean;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ initialValue, productId, isOwner }) => {
  const [content, setContent] = useState<string>(initialValue);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  const handleChange = (value: string) => {
    setContent(value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ description: content })
        .eq('id', productId);

      if (error) {
        throw error;
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Product description updated successfully",
      });
    } catch (error) {
      console.error('Error saving product description:', error);
      toast({
        title: "Error",
        description: "Failed to update product description",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean'],
      [{ 'table': [] }]
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'table'
  ];

  if (!isOwner) {
    return content ? (
      <Card>
        <CardContent className="pt-6">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </CardContent>
      </Card>
    ) : null;
  }

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative mt-10">
      <CardHeader className="bg-gradient-brand p-4">
        <CardTitle className="text-2xl font-bold text-text-dark">Product Information</CardTitle>
      </CardHeader>
      <CardContent>
        {!content && !isEditing ? (
          <div>
            <p className="mb-4">No product information available.</p>
            {isOwner && (
              <Button onClick={() => setIsEditing(true)} className="btn-primary">
                Add Product Information
              </Button>
            )}
          </div>
        ) : isEditing ? (
          <ReactQuill 
            theme="snow"
            value={content}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            className="h-[500px] mb-12"
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </CardContent>
      {isOwner && content && !isEditing && (
        <CardFooter className="flex justify-end space-x-2">
          <Button onClick={() => setIsEditing(true)} className="btn-primary">Edit</Button>
        </CardFooter>
      )}
      {isOwner && isEditing && (
        <CardFooter className="flex justify-end space-x-2">
          <Button onClick={handleSave} disabled={isSaving} className="btn-primary">
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={() => setIsEditing(false)} disabled={isSaving} className="btn-secondary">
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductEditor;