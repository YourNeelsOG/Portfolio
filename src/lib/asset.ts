// GitHub Pages serves the site under /Portfolio in production. next/image with
// `unoptimized` does not apply basePath to /public paths, so prefix them here.
export const BASE_PATH = process.env.NODE_ENV === "production" ? "/Portfolio" : "";

export const asset = (path: string) => `${BASE_PATH}${path}`;
