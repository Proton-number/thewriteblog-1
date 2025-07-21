"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function Blog({ posts }: BlogProps) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading time or wait for posts to be available
    if (posts && posts.length > 0) {
      setIsLoading(false);
    }
  }, [posts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 sm:p-6">
      {isLoading
        ? Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={`loading-skeleton-${idx}`}
              className="p-4 sm:p-6 space-y-4 animate-pulse"
            >
              <Skeleton className="h-40 sm:h-56 w-full rounded-md" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-9 w-24" />
            </Card>
          ))
        : posts?.map((post) => (
            <Card
              key={post.slug?.current}
              className="overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full"
            >
              <div className="relative w-full h-40 sm:h-48 md:h-70 ">
                <Image
                  alt={post?.mainImage?.alt || post.title}
                  src={post.mainImage?.asset?.url || "/vercel.svg"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105 p-6 rounded-t-md"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  priority
                />
              </div>

              <div className="p-4 sm:p-5 md:p-6 space-y-3 flex flex-col flex-grow">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold line-clamp-2 hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </CardDescription>
                <Link
                  href={`/Blog/${post.slug.current}`}
                  className="block mt-auto"
                >
                  <Button
                    variant="outline"
                    className="transition-all duration-300 hover:bg-gradient-to-r hover:from-primary hover:to-gray-500 hover:text-white cursor-pointer"
                    aria-label="Read more about this post"
                  >
                    Read More
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
    </div>
  );
}
