import { formatter } from "@/lib/formatter";
import { getPosts } from "@/lib/mdx";

import { Link as NextViewTransition } from "next-view-transitions";
import React from "react";

interface PostProps {
  category: string;
  singleDate?: boolean;
  showCount?: boolean;
}

export const Posts = ({ category, singleDate = false, showCount = true }: PostProps) => {
  const posts = getPosts(category).sort((a, b) => {
    return new Date(b.time.created).getTime() - new Date(a.time.created).getTime();
  });

  const Seperator = () => <div className="border-border border-t" />;

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col">
      <NextViewTransition href={`/${category}`} className="flex justify-between">
        <h2 className="py-2 text-muted capitalize">
          {category} {showCount && posts.length > 0 && `(${posts.length})`}
        </h2>
      </NextViewTransition>

      {posts.map((post) => {
        return (
          <React.Fragment key={post.slug}>
            <Seperator />
            <NextViewTransition href={`/${category}/${post.slug}`} className="flex w-full justify-between py-2">
              <p>{post.title}</p>
              <p className="mt-0 text-muted">
                {singleDate ? formatter.date(new Date(post.time.created)) : formatter.dateRange(new Date(post.time.created), new Date(post.time.updated))}
              </p>
            </NextViewTransition>
          </React.Fragment>
        );
      })}
    </div>
  );
};
