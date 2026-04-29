import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Permite imagens de qualquer domínio para o logo da customização
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
