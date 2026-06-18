import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site (every page is force-static, no runtime data).
  // Exporting to `out/` lets us deploy from the repo root with the vault on
  // disk at build time — no serverless, no "include files outside root" toggle.
  output: "export",
};

export default nextConfig;
