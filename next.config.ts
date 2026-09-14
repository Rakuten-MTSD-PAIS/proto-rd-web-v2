import type { NextConfig } from "next";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubActions ? "/proto-rd-web-v2" : "",
  assetPrefix: isGitHubActions ? "/proto-rd-web-v2/" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
