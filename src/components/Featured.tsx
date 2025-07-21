"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardDescription, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { sanityStore } from "@/store/sanityStore";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@clerk/nextjs";

export default function Featured() {
  const { posts, fetchFeaturedPosts } = sanityStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        await fetchFeaturedPosts();
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [fetchFeaturedPosts]);

  const { isSignedIn } = useAuth();

  return (
    <section className="p-4 flex flex-col gap-8 bg-gradient-to-b from-white to-gray-50 min-h-[80vh]">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-2 ">
      Featured Posts
      </h1>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 p-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx} className="p-6 space-y-4 animate-pulse rounded-xl shadow-md bg-white/80 border border-gray-200">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-24" />
              </Card>
            ))
          : posts?.map((item) => (
              <Card
                key={item.title}
                className=" transition-all duration-200 hover:shadow-xl hover:-translate-y-1 rounded-xl border border-gray-200 bg-white/90"
              >
                <CardHeader className="p-0">
                  <div className="relative h-56 w-full rounded-t-xl overflow-hidden">
                    <Image
                      alt={item?.mainImage?.alt || item.title}
                      src={item.mainImage?.asset?.url || "/vercel.svg"}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </CardHeader>
                <div className="p-6 flex flex-col h-full">
                  <CardTitle className="text-2xl font-semibold mb-1  transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                    {item.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    {item.author && (
                      <span>
                        By <span className="font-medium text-gray-700">{item.author.name}</span>
                      </span>
                    )}
                    {item.publishedAt && (
                      <span>· {new Date(item.publishedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="mt-auto">
                    <Link
                      href={isSignedIn ? `/Blog/${item.slug.current}` : "/Login"}
                      passHref
                    >
                      <Button
                        variant="outline"
                        className="w-full group-hover:text-white transition-colors"
                      >
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
      </div>
    </section>
  );
}
