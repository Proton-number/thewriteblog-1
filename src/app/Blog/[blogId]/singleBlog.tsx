"use client";

import { Card } from "@/components/ui/card";
import { sanityStore } from "@/store/sanityStore";
import { PortableText } from "@portabletext/react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { SingleBlogProps } from "@/types/types";

function SingleBlog({ singlePost }: SingleBlogProps) {
  const { morePosts, fetchMorePosts } = sanityStore();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!morePosts) {
      fetchMorePosts();
      return;
    }
    setIsLoading(morePosts.length === 0); // Check if posts are empty to set loading state
  }, [fetchMorePosts, morePosts]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 w-full lg:max-w-4xl flex flex-col mb-6 lg:mb-0 h-full">
        {singlePost.mainImage && (
          <div className="relative w-full aspect-[16/9] mb-6 min-h-[250px] max-h-[450px]">
            <Image
              alt={singlePost.title}
              src={singlePost?.mainImage.asset?.url || "/vercel.svg"}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 1024px) 100vw, 800px"
              priority // Load the image immediately
              loading="eager" // Ensure the image is loaded eagerly
              placeholder="blur" // Use blur placeholder for better UX
              blurDataURL={singlePost?.mainImage.asset?.url || "/vercel.svg"} // Placeholder image
            />
          </div>
        )}
        <h1 className="font-bold text-2xl sm:text-3xl mb-2">
          {singlePost.title}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center text-gray-500 text-sm mb-4 gap-1 sm:gap-4">
          <p>{singlePost.author?.name}</p>
          <span className="hidden sm:inline">•</span>
          <p>
            {singlePost?.publishedAt
              ? new Date(singlePost.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </p>
        </div>
        <div className="prose max-w-none">
          <PortableText value={singlePost.body} />
        </div>
      </div>

      {/* More posts section  */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">More Posts</h2>
        <div className="space-y-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <Card
                  key={`loading-skeleton-${idx}`}
                  className="p-4 sm:p-6 space-y-4 animate-pulse"
                >
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-9 w-24" />
                </Card>
              ))
            : morePosts
                ?.filter(
                  (post) => post.slug?.current !== singlePost.slug?.current // Exclude the current post
                )
                .map((post) => (
                  <Link
                    key={post.slug?.current}
                    href={`/Blog/${post.slug.current}`}
                  >
                    <Card className="cursor-pointer hover:bg-gray-100 p-4 sm:p-6 transition-all duration-200 hover:shadow-lg mt-4">
                      <h3 className="font-semibold text-base sm:text-lg truncate">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {post.description || "No description available."}
                      </p>
                    </Card>
                  </Link>
                ))}
          <div>
            <Link href={`/Blog`}>
              <Button
                variant={"ghost"}
                className="mt-4 hover:underline hover:bg-transparent cursor-pointer"
              >
                View All Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleBlog;
