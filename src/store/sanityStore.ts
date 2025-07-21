import { create } from "zustand";
import sanityClient from "../../Client";
import type { Post, Author } from "@/types/types";

interface SanityStore {
  error: null | string;
  posts: Array<Post> | null;
  fetchPosts: () => Promise<void>;
  fetchFeaturedPosts: () => Promise<void>;
  author: Author | null;
  fetchAuthor: (detailsId: string) => Promise<void>;
  morePosts: Array<Post> | null;
  fetchMorePosts: () => Promise<void>;
}

export const sanityStore = create<SanityStore>((set) => {
  // Common query fragments
  const AUTHOR_FRAGMENT = `
  _id,
  name,
  slug,
  title,
  phone,
  email,
  bio,
  "authorImage": image.asset->url
`;
 
  const IMAGE_FRAGMENT = `
    asset->{
      _id, 
      url
    }, 
    alt
  `;

  // Error handler
  const handleError = (
    error: Error | unknown,
    errorMessage: string,
    resetState: Partial<SanityStore>
  ) => {
    console.error(`Error: ${errorMessage}:`, error);
    set({ error: errorMessage, ...resetState });
  };

  return {
    error: null,
    posts: null,
    singlePosts: null,
    author: null,
    morePosts: null,
    fetchMorePosts: async () => {
      const query = `*[_type == "post"] | order(_createdAt asc)[0...5]{
        title, 
        slug, 
        description,  
        projectUrl,
      
        mainImage{${IMAGE_FRAGMENT}}, 
        body,
        author->{${AUTHOR_FRAGMENT}}
      }`;

      try {
        const response = await sanityClient.fetch<Array<Post>>(query);
        set({ morePosts: response, error: null });
      } catch (error) {
        handleError(error, "Failed to fetch more projects", {
          morePosts: null,
        });
      }
    },

    fetchPosts: async () => {
      const query = `*[_type == "post"] | order(_createdAt asc) {
        title, 
        slug, 
        description,  
        projectUrl,
      
        mainImage{${IMAGE_FRAGMENT}}, 
        body,
        author->{${AUTHOR_FRAGMENT}}
      }`;

      try {
        const response = await sanityClient.fetch<Array<Post>>(query);
        set({ posts: response, error: null });
      } catch (error) {
        handleError(error, "Failed to fetch projects", { posts: null });
      }
    },

    fetchFeaturedPosts: async () => {
      const query = `*[_type == "post"] | order(_createdAt asc)[0...3]{
        title, 
        description, 
        slug, 
        mainImage{${IMAGE_FRAGMENT}}, 
        body,
        author->{${AUTHOR_FRAGMENT}}
      }`;

      try {
        const response = await sanityClient.fetch<Array<Post>>(query);
        set({ posts: response, error: null });
      } catch (error) {
        handleError(error, "Failed to fetch projects", { posts: null });
      }
    },

    fetchAuthor: async (detailsId: string) => {
      const query = `*[_type == "author" && _id == "${detailsId}"]{
        ${AUTHOR_FRAGMENT}
      }`;

      try {
        const response = await sanityClient.fetch(query);
        set({ author: response[0] || null, error: null });
      } catch (error) {
        handleError(error, "Failed to fetch author", { author: null });
      }
    },
  };
});
