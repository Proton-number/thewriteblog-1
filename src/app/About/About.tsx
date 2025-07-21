import { Card } from "@/components/ui/card";
import React from "react";

export default function About() {
  const cardContent = [
    {
      title: "Tech Passions",
      description:
        "React, Next.js, Tailwind, Firebase, and Supabase fuel my curiosity. I'm always tinkering with side projects and exploring new tech.",
    },
    {
      title: "Beyond Coding",
      description:
        "Football debates, Afrobeats playlists, and anime binges keep life colorful. There's more to me than just code.",
    },
    {
      title: "This Space",
      description:
        "My digital journal, a place for thoughts, cool things I learnt, and documenting this chaotic ride.",
    },
  ];

  return (
    <div className="flex items-center justify-center flex-col pt-8 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full px-4">
        {cardContent.map((card, index) => (
          <Card
            key={index}
            className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-white"
          >
            <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
            <p className="text-gray-700">{card.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
