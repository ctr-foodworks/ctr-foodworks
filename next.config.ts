import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — emits a deployable site to ./out for Netlify drag-and-drop
  // (or any static host). Notes:
  //   · No server routes — /api/* is temporarily disabled (see app/api/_disabled)
  //   · No Image Optimization at runtime → use `unoptimized` for <Image>
  //   · trailingSlash makes each route a folder index, friendlier for static hosts
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
