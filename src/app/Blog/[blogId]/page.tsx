// src/app/Blog/[blogId]/page.tsx

import sanityClient from "../../../../Client";
import SingleBlog from "./singleBlog";
import type { Post } from "@/types/types";

// No external Props type — just local destructuring
export default async function BlogPage({
  params,
}: {
  params: { blogId: string };
}) {
  const { blogId } = params;

  const query = `*[_type == "post" && slug.current == $slug][0] {
    title, 
    description,  
    slug, 
    projectUrl,
    mainImage {
      asset -> {
        _id, 
        url
      }, 
      alt
    }, 
    body,
    author -> {
      _id, 
      name
    },
    publishedAt
  }`;

  let singlePost: Post | null = null;

  try {
    singlePost = await sanityClient.fetch(query, { slug: blogId });
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
  }

  if (!singlePost) {
    return <div>Post not found</div>;
  }

  return <SingleBlog singlePost={singlePost} />;
}
