import type { Metadata } from "next";
import type { Post } from "@/types/types";

import sanityClient from "../../../../Client";
import SingleBlog from "./singleBlog";

// Fix 1: Update this to use the expected prop shape for dynamic routes
type BlogPageProps = {
  params: { blogId: string };
};

// ✅ Fix 2: Now you're telling TypeScript exactly what it's expecting
export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const query = `*[_type == "post" && slug.current == $slug][0] { title }`;
  const post = await sanityClient.fetch(query, { slug: params.blogId });

  return {
    title: post?.title || "Blog Post",
  };
}

// ✅ Fix 3: Apply the same typing to your page component
export default async function BlogPage({ params }: BlogPageProps) {
  const blogId = params.blogId;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const query = `*[_type == "post" && slug.current == $slug][0] {
    title, 
    description,  
    slug, 
    projectUrl,
    mainImage{asset->{_id, url}, alt}, 
    body,
    author->{_id, name},
    publishedAt,
  }`;

  let singlePost: Post | null = null;

  try {
    singlePost = await sanityClient.fetch<Post>(query, {
      slug: blogId,
    });
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
  }

  if (!singlePost) {
    return <div>Post not found</div>;
  }

  return <SingleBlog singlePost={singlePost} />;
}
