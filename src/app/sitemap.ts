import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rirstudio.my.id';

// Static pages that should always be in the sitemap
const staticPages: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/projects`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    // Get all published blog posts
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
    });

    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Get all projects
    const projects = await prisma.project.findMany({
      select: { slug: true, updatedAt: true },
    });

    const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

    dynamicEntries = [...postEntries, ...projectEntries];
  } catch (error) {
    // If database query fails, still return static pages
    // This prevents sitemap from returning a 500 error
    console.error('Sitemap: Failed to fetch dynamic entries:', error);
  }

  return [...staticPages, ...dynamicEntries];
}
