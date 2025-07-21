interface Image {
  asset?: {
    _id: string;
    url: string;
  };
  alt: string;
}
interface PortableTextSpan {
  _key: string;
  _type: "span";
  text: string;
  marks?: string[];
}

interface PortableTextImage {
  _key: string;
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  caption?: string;
  alt?: string;
}

// Mark definition types
interface LinkMarkDef {
  _key: string;
  _type: "link";
  href: string;
  blank?: boolean;
}

interface InternalLinkMarkDef {
  _key: string;
  _type: "internalLink";
  reference: {
    _ref: string;
    _type: "reference";
  };
}

type MarkDef = LinkMarkDef | InternalLinkMarkDef;

// Block types
interface PortableTextBlock {
  _key: string;
  _type: "block";
  children: Array<PortableTextSpan>;
  markDefs: MarkDef[];
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote" | "code";
  listItem?: "bullet" | "number";
  level?: number;
}

// Main content types
type PortableTextContent = PortableTextBlock | PortableTextImage;

interface Post {
  title: string;
  description: string;
  slug: {
    current: string;
  };
  mainImage?: Image;
  body: PortableTextContent[];
  _id: string;
  author?: {
    _id: string;
    name: string;
  };

  projectUrl?: string;
  publishedAt?: string;
}
interface Author {
  _id: string;
  name: string;
  slug?: {
    current: string;
  };
  title?: string;
  phone?: string;
  bio?: PortableTextContent[];
  authorImage?: string;
}

// for the blogs
interface BlogProps {
  posts: Post[];
}

// for singleBlog
interface SingleBlogProps {
  singlePost: Post;
}

export type {
  Post,
  Author,
  BlogProps,
  SingleBlogProps,
  PortableTextContent,
  PortableTextBlock,
  PortableTextSpan,
  PortableTextImage,
  Image,
  MarkDef,
  LinkMarkDef,
  InternalLinkMarkDef,
};
export default Post;
