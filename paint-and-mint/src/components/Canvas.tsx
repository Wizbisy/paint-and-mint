"use client";
import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { useAccount, useWriteContract } from "wagmi";
import { uploadToPinata } from "../utils/pinata";
import { config } from "../config/wagmi";
import { ArtNFTABI } from "../types";

const Canvas = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount({ config });
  const { writeContract, isPending, error: writeError } = useWriteContract();
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sketchRef.current) return;

    const contractAddress = process.env.NEXT_PUBLIC_ART_NFT_CONTRACT_ADDRESS || "";
    if (!contractAddress) {
      setError("Missing contract address.");
      return;
    }

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
    return () => {
      p5Instance.remove();
    };
  }, []);

  useEffect(() => {
    if (writeError) setError(`Contract error: ${writeError.message}`);
  }, [writeError]);

  const handleMint = async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet.");
      return;
    }

    setMinting(true);
    try {
      const canvas = sketchRef.current?.querySelector("canvas");
      if (!canvas) throw new Error("Canvas not found");
      const dataUrl = canvas.toDataURL("image/png");
      const ipfsUrl = await uploadToPinata(dataUrl, `Artwork-${Date.now()}`);

      const contractAddress = process.env.NEXT_PUBLIC_ART_NFT_CONTRACT_ADDRESS;
      if (!contractAddress) throw new Error("Contract address missing");

      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: ArtNFTABI,
        functionName: "mintTo",
        args: [address, ipfsUrl],
      });
    } catch (err: any) {
      setError(`Minting failed: ${err.message || err}`);
    } finally {
      setMinting(false);
    }
  };

  if (error) return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;

  return (
    <div>
      <div ref={sketchRef}></div>
      <button onClick={handleMint} disabled={minting || isPending || !isConnected}>
        {minting || isPending ? "Minting..." : "Mint Artwork"}
      </button>
    </div>
  );
};

export default Canvas;
