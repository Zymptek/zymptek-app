"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProductEditor } from '@/hooks/useProductEditor';
import { Loading } from '@/components/loading';
import { Carousel } from 'react-responsive-carousel';
import AttributeSection from '@/components/product/AttributeSection';
import PricingSection from '@/components/product/PricingSection';
import VariationsSection from '@/components/product/VariableSection';
import SimilarProducts from '@/components/product/SimilarProducts';
import ActionButtons from '@/components/product/ActionButtons';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactMarkdown from 'react-markdown';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

// Constants for view tracking
const MIN_VIEW_TIME = 5000; // 5 seconds minimum time on page
const VIEW_COOLDOWN = 1800000; // 30 minutes between views from same user

const ProductPage = () => {
  const { user } = useAuth();
  const { productId } = useParams();
  const { product, isLoading } = useProductEditor(productId as string);
  const supabase = createClientComponentClient<Database>();
  const [hasRecordedView, setHasRecordedView] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let mounted = true;

    const recordView = async () => {
      if (!productId || hasRecordedView) return;

      // Check if we've recorded a view recently using sessionStorage
      const lastViewTime = sessionStorage.getItem(`product_view_${productId}`);
      const currentTime = Date.now();
      
      if (lastViewTime && currentTime - parseInt(lastViewTime) < VIEW_COOLDOWN) {
        return;
      }

      // Wait for minimum view time before recording
      timeoutId = setTimeout(async () => {
        if (!mounted) return;

        try {
          await supabase.rpc('record_product_view', {
            _product_id: productId as string,
            _viewer_id: user?.id,
            _ip_address: undefined,
            _user_agent: window.navigator.userAgent
          });

          // Record the view time in sessionStorage
          sessionStorage.setItem(`product_view_${productId}`, currentTime.toString());
          setHasRecordedView(true);
        } catch (error) {
          console.error('Error recording view:', error);
        }
      }, MIN_VIEW_TIME);
    };

    recordView();

    // Cleanup function
    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [productId, user?.id, supabase, hasRecordedView]);

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
              <ActionButtons isProductSeller={isProductSeller} product={product} sellerId={product.seller_id} />
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-brand-300 mb-4">Product Description</h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{product.description || ''}</ReactMarkdown>
          </div>
        </div>
      </div>

      <SimilarProducts product={product} />
    </div>
  );
};

export default ProductPage;