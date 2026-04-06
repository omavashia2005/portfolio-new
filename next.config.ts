import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // required — workerd runtime can't run sharp/squoosh
  },
};

export default nextConfig;
