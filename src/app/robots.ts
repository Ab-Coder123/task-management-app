import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://taskmanagement-frontend-one.vercel.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/download', '/login', '/register'],
        disallow: ['/admin/', '/dashboard/', '/tasks/', '/waiting-approval', '/offline'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
