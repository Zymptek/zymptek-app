const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  {
    url: 'https://images.livemint.com/img/2024/03/27/1600x900/Export_1711524561009_1711524561336.jpg',
    filename: 'export-growth.jpg'
  },
  {
    url: 'https://img.etimg.com/thumb/msid-107937082,width-800,height-450,imgsize-56894,resizemode-75/manufacturing-pmi_istock.jpg',
    filename: 'manufacturing-pmi.jpg'
  },
  {
    url: 'https://www.investindia.gov.in/themes/investindia/image/sectors/manufacturing-small.jpg',
    filename: 'pli-scheme.jpg'
  }
];

// Create blog directory if it doesn't exist
const blogDir = path.join(process.cwd(), 'public', 'blog');
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// Download images
images.forEach(image => {
  const filepath = path.join(blogDir, image.filename);
  https.get(image.url, (response) => {
    const fileStream = fs.createWriteStream(filepath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Downloaded: ${image.filename}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${image.filename}:`, err.message);
  });
}); 