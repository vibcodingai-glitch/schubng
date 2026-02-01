import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,

    // Image optimization
    images: {
        // Allow images from Supabase storage
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
            },
        ],
        // Optimize image format
        formats: ['image/avif', 'image/webp'],
        // Minimize image sizes
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },

    // Compiler optimizations
    compiler: {
        // Remove console.log in production
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },

    // Experimental features for performance
    experimental: {
        // Enable optimized package imports
        optimizePackageImports: [
            'lucide-react',
            'date-fns',
            '@radix-ui/react-icons',
            'recharts',
        ],
    },

    // Headers (backup for non-Vercel deployments)
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
