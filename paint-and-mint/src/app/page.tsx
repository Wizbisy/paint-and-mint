"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Canvas = dynamic(() => import("../components/Canvas").catch((err) => {
  console.error("Failed to load Canvas component:", err);
  return { default: () => <p>Error loading canvas: {err.message}</p> };
}), {
  ssr: false,
  loading: () => <p>Loading canvas...</p>,
});

export default function Home() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Home page rendered");
  }, []);

  if (error) {
    return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;
  }

  return (
    <main>
      <h1>Paint & Mint on Farcaster</h1>
      <Canvas />
    </main>
  );
}
