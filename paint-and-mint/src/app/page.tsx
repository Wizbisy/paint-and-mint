"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const Canvas = dynamic(() => import("../components/Canvas").catch((err) => {
  console.error("Failed to load Canvas component:", err);
  return { default: () => <p>Error loading canvas. Check console.</p> };
}), {
  ssr: false,
  loading: () => <p>Loading canvas...</p>,
});

export default function Home() {
  useEffect(() => {
    console.log("Home page rendered");
  }, []);

  return (
    <main>
      <h1>Paint & Mint on Farcaster</h1>
      <Canvas />
    </main>
  );
}
