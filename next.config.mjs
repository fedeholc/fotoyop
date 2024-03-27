// @ts-check
import withSerwistInit from "@serwist/next";

const USE_PWA = false;

const withSerwist = withSerwistInit({
  cacheOnFrontEndNav: true,
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
