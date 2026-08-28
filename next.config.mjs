/** @type {import('next').NextConfig} */

// GitHub Pages serves this project site under https://<user>.github.io/Portfolio/,
// so production builds need a base path and static export. Dev stays at root.
const isProd = process.env.NODE_ENV === "production";
const repo = "Portfolio";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? `/${repo}` : undefined,
  assetPrefix: isProd ? `/${repo}/` : undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
