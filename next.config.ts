import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Only public deploy metadata is inlined; credentials stay in runtime variables.
  env: {
    AMV_DEPLOY_CONTEXT: process.env.CONTEXT ?? "dev",
    AMV_DEPLOY_ID: process.env.DEPLOY_ID ?? "local",
    AMV_DEPLOY_URL: process.env.DEPLOY_URL ?? "http://localhost:3000",
  },
};

export default nextConfig;
