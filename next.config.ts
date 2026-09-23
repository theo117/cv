import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { deviceSizes: [480, 800, 1440], imageSizes: [] },
};

export default nextConfig;
