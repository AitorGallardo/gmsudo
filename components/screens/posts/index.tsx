import type { Post } from "@/types";

import { TableOfContents } from "@/components/on-this-page";
import { PostNavigation } from "@/components/post-navigation";
import { formatter } from "@/lib/formatter";
import { getPosts } from "@/lib/mdx";
import { MDX } from "@/mdx-components";

import React from "react";
import { readingTime } from "reading-time-estimator";

interface Props {
  post: Post;
  route: string;
}

export const Layout = ({ post, route }: Props) => {
  const posts = getPosts(route);

  const Seperator = () => {
    return <div>⋅</div>;
  };

  const PublishedTime = () => {
    return <div>Published {formatter.date(new Date(post.time.created))}</div>;
  };
  const UpdateTime = () => {
    return <div>Updated {formatter.date(new Date(post.time.updated))}</div>;
  };

  const ReadingTime = () => {
    return <div>{readingTime(post.content).minutes} minutes read</div>;
  };

  return (
    <React.Fragment>
      <div className="flex flex-col">
        <div>
          <h1>
            {post.title}{" "}
            {post.pagesite?.url && (
              <a href={post.pagesite.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-muted">
                {post.pagesite.url}
              </a>
            )}
          </h1>
        </div>
        <div className="mt-1 flex gap-2 text-muted text-small">
          {!post.hideOptions?.hideCreated && <PublishedTime />}
          {!post.hideOptions?.hideUpdated && <Seperator />}
          {!post.hideOptions?.hideUpdated && <UpdateTime />}
          {!post.hideOptions?.hideReadingTime && <Seperator />}
          {!post.hideOptions?.hideReadingTime && <ReadingTime />}
        </div>
      </div>

      <MDX source={post.content} />
      <PostNavigation posts={posts} />
      <TableOfContents />
    </React.Fragment>
  );
};
