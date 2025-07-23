import sanityClient from "../../../../Client";
import SingleBlog from "./singleBlog";
import type { Post } from "@/types/types";

// ✅ Define your expected structure
type Props = {
  params: {
    blogId: string;
  };
};

const BlogPage = async ({ params }: Props) => {
  const blogId = params.blogId;

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
    singlePost = await sanityClient.fetch(query, {
      slug: blogId,
    });
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
  }

  if (!singlePost) {
    return <div>Post not found</div>;
  }

  return <SingleBlog singlePost={singlePost} />;
};

// ✅ This avoids Vercel's internal type conflict while enforcing your own
export default BlogPage satisfies (props: Props) => Promise<JSX.Element>;
