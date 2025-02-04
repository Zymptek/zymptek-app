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
            {
                hostname: 'avatars.githubusercontent.com',
                protocol: 'https',
            },
            {
                hostname: 'lh3.googleusercontent.com',
                protocol: 'https',
            },
            {
                protocol: 'https',
                hostname: 'images.livemint.com',
            },
            {
                protocol: 'https',
                hostname: 'www.investindia.gov.in',
            },
        ],
    },
};

module.exports = nextConfig;
