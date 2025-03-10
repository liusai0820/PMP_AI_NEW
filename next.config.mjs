/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-0711119e9c2f45d086d1017a74c99863.r2.dev',
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
    
    // 添加CSV文件的加载器
    config.module.rules.push({
      test: /\.csv$/,
      loader: 'csv-loader',
      options: {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true
      }
    });
    
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    turbo: {
      loaders: {
        '.csv': ['csv-loader']
      }
    }
  },
  serverExternalPackages: ['sharp'],
  env: {
    MISTRAL_API_KEY: 'bXkslXgU1KbER1anYhwicgw6zFjkqKjM',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
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