import Featured from "@/components/Featured";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div>
      {/* Centered Fullscreen Hero */}
      <Hero />

      {/* Rest of the content */}
      <Featured />
    </div>
  );
}
