/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        domains: ['aldlupglvfviscivquwa.supabase.co', "img.etimg.com", "via.placeholder.com", "i.pravatar.cc", "api.dicebear.com", "images.unsplash.com"], // Add your Supabase storage domain here
    }
};

module.exports = nextConfig;
