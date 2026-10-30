export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function publicPath(path) {
  return `${basePath}${path}`;
}
