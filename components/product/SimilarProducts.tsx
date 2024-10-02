import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/hooks/useProductEditor';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProductCard from '@/components/home/ProductCard';

interface SimilarProductsProps {
  product: Product;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ product }) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      setIsLoading(true);
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', product.category_id)
        .neq('product_id', product.product_id)
        .limit(4);

      if (error) {
        console.error('Error fetching similar products:', error);
      } else {
        setSimilarProducts(data as Product[]);
      }
      setIsLoading(false);
    };

    fetchSimilarProducts();
  }, [product.category_id, product.product_id]);

  return (
    <Card className="mt-8">
      <CardContent>
        <h2 className="text-2xl font-semibold mb-4">Similar Products</h2>
        {isLoading ? (
          <p>Loading similar products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {similarProducts.map((similarProduct) => (
              <ProductCard key={similarProduct.product_id} product={similarProduct} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimilarProducts;