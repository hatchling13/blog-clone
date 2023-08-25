import React from 'react';

import { getBlogPostList, loadBlogPost } from '@/helpers/file-helpers';
import { BLOG_TITLE, BLOG_DESCRIPTION } from "@/constants";

import BlogSummaryCard from '@/components/BlogSummaryCard';

import styles from './homepage.module.css';

export const metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION
}

async function Home() {
  const slugs = (await getBlogPostList()).map(obj => obj.slug);
  const posts = await Promise.all(slugs.map(async (slug) => loadBlogPost(slug)));

  const data = slugs.map((slug, index) => { return { slug, post: posts[index] } });

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.mainHeading}>
        Latest Content:
      </h1>

      {data.map(d => {
        const { slug, post } = d;
        const { frontmatter } = post;
        
        return (
          <BlogSummaryCard
            key={slug}
            slug={slug}
            title={frontmatter["title"]}
            abstract={frontmatter["abstract"]}
            publishedOn={frontmatter["publishedOn"]}
          />
        )
      })}
    </div>
  );
}

export default Home;
