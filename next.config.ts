import type { NextConfig } from "next"

const config: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    tsconfigPath: "./tsconfig.json"
  }
}

export default config
