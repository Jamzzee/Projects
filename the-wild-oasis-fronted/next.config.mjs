/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qydlitafmsldmdsunmxd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/cabin-images/**',
      },
      {
        protocol: 'https',
        hostname: 'dclaevazetcjjkrzczpc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/cabin-images/**',
      },
    ],
    domains: ['lh3.googleusercontent.com'],
  },
  //* Needs for generate 'out' folder. Its generate only for SSG - static site generation. That's allow us to deploy this project without any problem on any deploying platforms, like Vercel, Netlify or Github..
  //* Comment it out when you want to continue deweloping.
  // output: 'export',
};

export default nextConfig;
