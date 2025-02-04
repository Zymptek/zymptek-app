const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const dirs = ['public/blog', 'public/team'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy placeholder images from a CDN
const images = [
  {
    url: 'https://source.unsplash.com/800x600/?manufacturing,industry',
    path: 'public/blog/manufacturing.jpg'
  },
  {
    url: 'https://source.unsplash.com/800x600/?sustainability,green',
    path: 'public/blog/sustainable-sourcing.jpg'
  },
  {
    url: 'https://source.unsplash.com/800x600/?shipping,trade',
    path: 'public/blog/import-regulations.jpg'
  },
  {
    url: 'https://source.unsplash.com/400x400/?businessman,indian',
    path: 'public/team/rajesh-kumar.jpg'
  },
  {
    url: 'https://source.unsplash.com/400x400/?businesswoman,indian',
    path: 'public/team/priya-sharma.jpg'
  },
  {
    url: 'https://source.unsplash.com/400x400/?professional,indian',
    path: 'public/team/arun-patel.jpg'
  }
];

console.log('Starting image generation...');
console.log('Please run: npm install node-fetch');
console.log('Then run: node scripts/generate-blog-images.js');
console.log('This will download placeholder images from Unsplash for the blog posts.'); 