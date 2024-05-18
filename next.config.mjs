// @ts-check
import withSerwistInit from "@serwist/next";

const USE_PWA = true;

const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

let config = nextConfig;

if (USE_PWA) {
  config = withSerwist(nextConfig);
}

export default config;
