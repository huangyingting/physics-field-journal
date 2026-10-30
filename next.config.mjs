import { chapters } from './lib/catalog.js';

const pages = process.env.GITHUB_PAGES === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default {
  basePath,
  ...(pages ? { output: 'export', trailingSlash: true, images: { unoptimized: true } } : {}),
  ...(!pages ? {
  async rewrites() {
    return [
      { source: '/legacy', destination: '/legacy/index.html' },
      ...['equations', ...chapters.map(chapter => chapter.slug)].map(slug => ({
        source: `/legacy/${slug}`,
        destination: `/legacy/${slug}/index.html`,
      })),
    ];
  },
  async redirects() {
    return [
      { source: '/', destination: '/zh', permanent: false },
      { source: '/equations', destination: '/en/equations', permanent: true },
      ...chapters.map(({ slug }) => ({
        source: `/${slug}`,
        destination: `/en/explore/${slug}`,
        permanent: true,
      })),
    ];
  },
  } : {}),
};
