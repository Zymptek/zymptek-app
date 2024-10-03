/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                hostname: 'aldlupglvfviscivquwa.supabase.co',
                protocol: 'https',
            },
            {
                hostname: 'img.etimg.com',
                protocol: 'https',
            },
            {
                hostname: 'via.placeholder.com',
                protocol: 'https',
            },
            {
                hostname: 'i.pravatar.cc',
                protocol: 'https',
            },
            {
                hostname: 'api.dicebear.com',
                protocol: 'https',
            },
            {
                hostname: 'images.unsplash.com',
                protocol: 'https',
            },
        ], // Add your Supabase storage domain here
    }
};

module.exports = nextConfig;
