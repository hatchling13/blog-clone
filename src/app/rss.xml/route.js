import RSS from "rss";
import { NextResponse } from "next/server";

import { getBlogPostList, loadBlogPost } from "@/helpers/file-helpers";

import { BLOG_TITLE, BLOG_DESCRIPTION } from "@/constants";

export async function GET() {
  const slugs = (await getBlogPostList()).map(obj => obj.slug);
  const posts = await Promise.all(slugs.map(async (slug) => loadBlogPost(slug)));
  const data = slugs.map((slug, index) => { return { slug, post: posts[index] } });

  const site_url = 'http://localhost:3000';

  const feedOptions = {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    site_url: site_url,
    feed_url: `${site_url}/rss.xml`
  }

  const feed = new RSS(feedOptions);

  data.map(d => {
    const { slug, post } = d;
    const { frontmatter } = post;
    
    feed.item({
      title: frontmatter["title"],
      description: frontmatter["abstract"],
      url: `${site_url}/${slug}`,
      date: frontmatter["publishedOn"]
    })
  });

  return new NextResponse(feed.xml(), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}