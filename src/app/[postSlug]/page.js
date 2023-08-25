import React from 'react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import { loadBlogPost } from "@/helpers/file-helpers";

import BlogHero from '@/components/BlogHero';
import CodeSnippet from '@/components/CodeSnippet';

import styles from './postSlug.module.css';
import { MDXRemote } from 'next-mdx-remote/rsc';

export const memoizePost = React.cache(async (slug) => await loadBlogPost(slug))

const DivisionGroupsDemo = dynamic(() => import('@/components/DivisionGroupsDemo'))
const CircularColorsDemo = dynamic(() => import('@/components/CircularColorsDemo'))

export async function generateMetadata({ params }) {
  const post = await memoizePost(params.postSlug);

  if (!post) {
    return null;
  }

  const { frontmatter } = post;

  return {
    title: frontmatter["title"],
    description: frontmatter["abstract"]
  }
}

const components = {
  pre: (props) => <CodeSnippet>{props.children}</CodeSnippet>,
  DivisionGroupsDemo: (props) => <DivisionGroupsDemo {...props} />,
  CircularColorsDemo: (props) => <CircularColorsDemo {...props} />
}

async function BlogPost({ params }) {
  const post = await memoizePost(params.postSlug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  return (
    <article className={styles.wrapper}>
      <BlogHero
        title={frontmatter["title"]}
        publishedOn={frontmatter["publishedOn"]}
      />
      <div className={styles.page}>
        <MDXRemote components={components} source={content} />
      </div>
    </article>
  );
}

export default BlogPost;
