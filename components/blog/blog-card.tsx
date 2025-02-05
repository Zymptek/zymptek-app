import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/types/blog';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative h-48">
        <Image 
          src={post.coverImage} 
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-brand-200">{post.author.name}</p>
            <p className="text-xs text-brand-300">{post.author.role}</p>
          </div>
        </div>
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-brand-200 bg-brand-100 rounded-full">
            {post.category}
          </span>
        </div>
        <h3 className="font-semibold text-xl mb-2 text-brand-200 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-brand-300 mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-sm text-brand-300">
          <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
          <span>{post.readTime}</span>
        </div>
        <Link 
          href={`/blog/${post.id}`}
          className="mt-4 inline-block text-brand-200 hover:text-brand-300 font-medium"
        >
          Read More →
        </Link>
      </div>
    </motion.div>
  );
} 