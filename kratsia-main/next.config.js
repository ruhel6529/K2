/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lacgiuwfsnognkogylqw.supabase.co"],
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
