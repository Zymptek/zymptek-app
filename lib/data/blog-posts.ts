import { BlogPost } from '../types/blog';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Rise of Indian Manufacturing: A Global Perspective',
    excerpt: 'How India is becoming a manufacturing powerhouse and what it means for global trade.',
    content: `India's manufacturing sector is undergoing a remarkable transformation...`,
    coverImage: '/blog/manufacturing.jpg',
    author: {
      name: 'Rajesh Kumar',
      avatar: '/team/rajesh-kumar.jpg',
      role: 'Industry Analyst'
    },
    publishedAt: '2024-03-28',
    readTime: '5 min read',
    category: 'Industry Insights',
    tags: ['manufacturing', 'make-in-india', 'global-trade']
  },
  {
    id: '2',
    title: 'Sustainable Sourcing: The Future of B2B Trade',
    excerpt: 'Why sustainable sourcing is becoming crucial for businesses and how to implement it effectively.',
    coverImage: '/blog/sustainable-sourcing.jpg',
    content: `As global awareness about environmental impact grows...`,
    author: {
      name: 'Priya Sharma',
      avatar: '/team/priya-sharma.jpg',
      role: 'Sustainability Expert'
    },
    publishedAt: '2024-03-25',
    readTime: '4 min read',
    category: 'Sustainability',
    tags: ['sustainability', 'green-business', 'responsible-sourcing']
  },
  {
    id: '3',
    title: 'Navigating Import Regulations: A Comprehensive Guide',
    excerpt: 'Essential information about import regulations and compliance for successful international trade.',
    coverImage: '/blog/import-regulations.jpg',
    content: `Understanding import regulations is crucial for any business...`,
    author: {
      name: 'Arun Patel',
      avatar: '/team/arun-patel.jpg',
      role: 'Trade Compliance Expert'
    },
    publishedAt: '2024-03-22',
    readTime: '6 min read',
    category: 'Compliance',
    tags: ['regulations', 'compliance', 'international-trade']
  }
]; 