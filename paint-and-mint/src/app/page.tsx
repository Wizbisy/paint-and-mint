import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("../components/Canvas"), { ssr: false });

export default function Home() {
  return (
    <main>
      <h1>Paint & Mint on Farcaster</h1>
      <Canvas />
    </main>
  );
}
