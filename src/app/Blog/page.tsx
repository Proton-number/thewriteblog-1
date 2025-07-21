import sanityClient from "../../../Client";
import Blog from "./Blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
};

async function BlogPage() {
  const query = `*[_type == "post"] {
        title, 
        description,  
        slug, 
        projectUrl,
        mainImage{asset->{_id, url}, alt}, 
        author->{_id, name}
    }`;

  let posts: Post[] = [];

  try {
    posts = await sanityClient.fetch<Post[]>(query);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">No blog posts found.</div>
    );
  }

  return <Blog posts={posts} />;
}

export default BlogPage;
