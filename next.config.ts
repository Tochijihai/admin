import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
	webpack: (config) => {
		config.watchOptions = {
			poll: 1000,
			aggregateTimeout: 1000,
		};
		return config;
	},
};

export default nextConfig;
