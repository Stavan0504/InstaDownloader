import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'scontent-fra5-2.cdninstagram.com',
      'scontent.cdninstagram.com',
      'instagram.fccu3-1.fna.fbcdn.net',
      'scontent-iad3-1.cdninstagram.com',
      'via.placeholder.com',
      // Adding common Instagram CDN domains
      'instagram.com',
      'cdninstagram.com',
      'scontent.cdninstagram.com',
      'scontent-fra5-1.cdninstagram.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      }
    ]
  }
};

export default nextConfig;
