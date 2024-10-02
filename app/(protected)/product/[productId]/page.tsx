"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProductEditor } from '@/hooks/useProductEditor';
import { Loading } from '@/components/Loading';
import { Carousel } from 'react-responsive-carousel';
import AttributeSection from '@/components/product/AttributeSection';
import PricingSection from '@/components/product/PricingSection';
import VariationsSection from '@/components/product/VariableSection';
import SimilarProducts from '@/components/product/SimilarProducts';
import ActionButtons from '@/components/product/ActionButtons';
import ProductEditor from '@/components/product/ProductEditor';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ProductPage = () => {
  const { user } = useAuth();
  const { productId } = useParams();
  const { product, isLoading } = useProductEditor(productId as string);

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return <div className="text-center text-2xl mt-8">Product not found</div>;
  }

  const isProductSeller = product.seller_id === user?.id;

  return (
    <div className="bg-background-light min-h-screen">
      <div className='container mx-auto px-4 py-2'>
        <h1 className='text-2xl font-bold text-brand-300 mb-6'>{product.headline}</h1>
      
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div>
            <Carousel 
              useKeyboardArrows={true} 
              showStatus={false} 
              showThumbs={true}
              className='mb-8'
              thumbWidth={80}
              renderThumbs={() =>
                product.image_urls.map((url, index) => (
                  <div key={index} className="w-20 h-10">
                    <img src={url} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
                  </div>
                ))
              }
            >
            {product.image_urls.map((url, index) => (
              <div key={index} className="w-full h-[500px]">
                <img src={url} alt={`Product image ${index + 1}`} className="object-contain w-full h-full rounded-lg" />
              </div>
            ))}
          </Carousel>

            <div className="space-y-6">
              <AttributeSection
                title="Specifications"
                attributes={product.specifications || []}
              />
              <AttributeSection
                title="Packaging and Delivery"
                attributes={product.packaging || []}
              />
            </div>
        </div>

          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="bg-white rounded-lg p-6 shadow-md space-y-8">
              <PricingSection pricing={product.pricing || {}} />
              <VariationsSection variations={product.variations || []} />
              <ActionButtons isProductSeller={isProductSeller} productId={product.product_id} sellerId={product.seller_id} />
            </div>
          </div>
        </div>
      </div>

      <ProductEditor
            initialValue={product.description || ''}
            productId={product.product_id}
            isOwner={isProductSeller}
          />
      <SimilarProducts product={product} />
    </div>
  );
};

export default ProductPage;