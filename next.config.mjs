/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  env: {
    MISTRAL_API_KEY: 'bXkslXgU1KbER1anYhwicgw6zFjkqKjM',
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/projects/:id',
        destination: '/dashboard/projects/[id]',
      },
      {
        source: '/dashboard/projects/:id/edit',
        destination: '/dashboard/projects/[id]/edit',
      },
    ];
  },
};

export default nextConfig; 