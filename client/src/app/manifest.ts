import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ProteinPals - Indian Recipe PWA',
        short_name: 'ProteinPals',
        description: 'High-Protein Indian Breakfast and Lunchbox ideas for kids.',
        start_url: '/',
        display: 'standalone',
        background_color: '#F9FAFB',
        theme_color: '#22C55E',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
