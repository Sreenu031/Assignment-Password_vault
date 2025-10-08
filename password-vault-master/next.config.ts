import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_SECRET_KEY: process.env.NEXT_SECRET_KEY
  }
};

export default nextConfig;
