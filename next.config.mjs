/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["@vn-dylan/ui", "@vn-dylan/utils"],
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-better-sqlite3", "better-sqlite3"],
  experimental: {
    // `@vn-dylan/ui` là barrel kéo cả apexcharts/tiptap/jsvectormap — rewrite named
    // import về module path trực tiếp để tránh nạp toàn bộ (và lỗi `window is not defined` khi SSR).
    optimizePackageImports: ["@vn-dylan/ui"]
  }
};

export default nextConfig;
