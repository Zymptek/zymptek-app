import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProductCard from '@/components/home/ProductCard';

type ProductCardProps = {
  isSeller: boolean;
  user: Tables<'profiles'>;
};

const ProductList: React.FC<{ products: Tables<'products'>[] }> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
};

const SellerProductCard: React.FC<ProductCardProps> = ({ isSeller, user }) => {
  const [products, setProducts] = useState<Tables<'products'>[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.user_id);
      
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [user.user_id, supabase]);

  return (
    <Card id='products' className="mb-8 relative">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand-200">Products</CardTitle>
        {isSeller && (
          <Link href={`/create-product/${user.user_id}`} passHref>
            <Button
              className="absolute top-4 right-4 btn-primary flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Plus size={16} />
              Create Product
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-200"></div>
          </div>
        ) : products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <div className="flex justify-center items-center h-40">
            <div className="text-center text-gray-500">
              No products available
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SellerProductCard;