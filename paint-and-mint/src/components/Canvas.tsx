"use client";
import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { useAccount, useWriteContract } from "wagmi";
import { uploadToPinata } from "../utils/pinata";
import { config } from "../config/wagmi";
import { ArtNFTABI } from "../types";

const Canvas = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount({ config });
  const { writeContract, isPending } = useWriteContract();
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Canvas component mounted, initializing p5...");
    try {
      if (!sketchRef.current) throw new Error("Canvas container not found");
      const sketch = (p: p5) => {
        p.setup = () => {
          p.createCanvas(400, 400);
          p.background(255);
        };
        p.mouseDragged = () => {
          p.stroke(0);
          p.strokeWeight(5);
          p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
        };
      };
      const p5Instance = new p5(sketch, sketchRef.current);
      console.log("p5 initialized successfully");
      return () => {
        console.log("Cleaning up p5 instance");
        p5Instance.remove();
      };
    } catch (err) {
      console.error("p5 initialization failed:", err);
      setError("Failed to initialize canvas. Check console.");
    }
  }, []);

  const handleMint = async () => {
    if (!address) {
      alert("Connect your wallet via Farcaster!");
      return;
    }
    setMinting(true);
    try {
      const canvas = sketchRef.current?.querySelector("canvas");
      if (!canvas) throw new Error("Canvas element not found");
      const dataUrl = canvas.toDataURL("image/png");
      const ipfsUrl = await uploadToPinata(dataUrl, `Artwork-${Date.now()}`);
      const contractAddress = process.env.NEXT_PUBLIC_ART_NFT_CONTRACT_ADDRESS;
      if (!contractAddress) throw new Error("Contract address is missing");
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: ArtNFTABI,
        functionName: "mintTo",
        args: [address, ipfsUrl],
      });
      alert("NFT minted successfully!");
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed! Check console.");
      setError("Minting failed. Check console.");
    } finally {
      setMinting(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div ref={sketchRef}></div>
      <button onClick={handleMint} disabled={minting || isPending}>
        {minting || isPending ? "Minting..." : "Mint Artwork"}
      </button>
    </div>
  );
};

export default Canvas;
