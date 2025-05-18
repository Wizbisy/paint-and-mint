import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("../components/Canvas"), {
  ssr: false,
  loading: () => <p>Loading canvas...</p>,
});

export default function Home() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Paint & Mint on Farcaster</h1>
      <Canvas />
    </main>
  );
}
