import type { Post } from "@/types";

import { Layout } from "@/components/screens/posts";
import { getPosts } from "@/lib/mdx";
import { OpenGraph } from "@/lib/og";

import { notFound } from "next/navigation";

const route = "projects";

const Posts = getPosts(route);

interface PageProps {
  params: Post;
}

export async function generateStaticParams() {
  return Posts.map((post) => ({
    slug: `${post.slug}`,
  }));
}

export function generateMetadata({ params }: PageProps) {
  const post = Posts.find((post: { slug: string }) => post.slug === params.slug);
  const title = post?.seo?.title ?? post?.title ?? "";
  // Case pages carry their own pitch; without this every project shared on X
  // or LinkedIn fell back to the site-wide bio as its preview text.
  const description = post?.seo?.description ?? post?.summary ?? OpenGraph.description ?? undefined;

  return {
    ...OpenGraph,
    title,
    description,
    keywords: post?.seo?.keywords ?? OpenGraph.keywords,
    openGraph: {
      ...OpenGraph.openGraph,
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/${route}/${params.slug}`,
    },
    twitter: {
      ...OpenGraph.twitter,
      title,
      description,
    },
  };
}

export default function Page({ params }: PageProps) {
  const post = Posts.find((post: { slug: string }) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return <Layout post={post} route={route} />;
}
