import * as FadeIn from "@/components/motion/staggers/fade";
import { Posts } from "@/components/posts";
import { OpenGraph } from "@/lib/og";

import React from "react";

const category = "projects";

export function generateMetadata() {
  return {
    ...OpenGraph,
    category,
    openGraph: {
      category,
    },
  };
}

export default function Page() {
  return (
    <React.Fragment>
      <FadeIn.Item>
        <Posts singleDate={true} showCount={false} category={category} />
      </FadeIn.Item>
    </React.Fragment>
  );
}
