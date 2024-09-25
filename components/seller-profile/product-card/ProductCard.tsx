import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import { motion, useAnimation, useInView } from 'framer-motion';
import Link from 'next/link';

type ProductCardProps = {
  user: Tables<'profiles'>;
};

const ProductItem: React.FC<{ product: any; index: number }> = ({ product, index }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
      }}
      whileHover={{ scale: 1.05 }}
      className="border p-4 rounded-lg"
    >
      <h3 className="font-bold">{product.name}</h3>
      <p>{product.description}</p>
    </motion.div>
  );
};

const ProductList: React.FC<{ products: any[] }> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product, index) => (
        <ProductItem key={index} product={product} index={index} />
      ))}
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ user }) => {
  const [products, setProducts] = useState<any[]>([]);

  const handleCreateProduct = () => {
    // This is a placeholder. In a real application, you'd open a form or modal to create a product
    const newProduct = {
      name: `Product ${products.length + 1}`,
      description: 'New product description'
    };
    setProducts([...products, newProduct]);
  };

  return (
    <Card id='products' className="mb-8 relative">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand-200">Products</CardTitle>
        {user.user_type === 'SELLER' && (
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
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500">
              No products available
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;