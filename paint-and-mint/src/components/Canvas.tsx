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
    console.log("Canvas component mounted, checking environment...");
    try {
      if (!process.env.NEXT_PUBLIC_ART_NFT_CONTRACT_ADDRESS) {
        throw new Error("Environment variable NEXT_PUBLIC_ART_NFT_CONTRACT_ADDRESS is missing");
      }
      if (!sketchRef.current) {
        throw new Error("Canvas container DOM element not found");
      }
      console.log("Initializing p5...");
      const sketch = (p: p5) => {
        p.setup = () => {
          try {
            p.createCanvas(400, 400);
            p.background(255);
            console.log("p5 canvas created successfully");
          } catch (err) {
            throw new Error(`p5 setup failed: ${err}`);
          }
        };
        p.mouseDragged = () => {
          try {
            p.stroke(0);
            p.strokeWeight(5);
            p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
          } catch (err) {
            console.error("p5 mouseDragged error:", err);
          }
        };
      };
      const p5Instance = new p5(sketch, sketchRef.current);
      console.log("p5 initialized successfully");
      return () => {
        console.log("Cleaning up p5 instance");
        try {
          p5Instance.remove();
        } catch (err) {
          console.error("p5 cleanup error:", err);
        }
      };
    } catch (err) {
      console.error("Canvas initialization failed:", err);
      setError(`Failed to initialize canvas: ${err}`);
    }
  }, []);

  useEffect(() => {
    if (writeError) {
      console.error("Wagmi write contract error:", writeError);
      setError(`Contract error: ${writeError.message}`);
    }
  }, [writeError]);

  const handleMint = async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet!");
      return;
    }
    setMinting(true);
    try {
      const canvas = sketchRef.current?.querySelector("canvas");
      if (!canvas) throw new Error("Canvas element not found");
      const dataUrl = canvas.toDataURL("image/png");
      console.log("Uploading to Pinata via API...");
      const ipfsUrl = await uploadToPinata(dataUrl, `Artwork-${Date.now()}`);
      console.log("Pinata upload successful, IPFS URL:", ipfsUrl);
      const contractAddress = process.env.NEXT_PUBLIC_ART_NFT_CONTRACT_ADDRESS;
      if (!contractAddress) throw new Error("Contract address is missing");
      console.log("Minting NFT to contract:", contractAddress);
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: ArtNFTABI,
        functionName: "mintTo",
        args: [address, ipfsUrl],
      });
      console.log("Mint transaction sent");
    } catch (error) {
      console.error("Minting failed:", error);
      setError(`Minting failed: ${error}`);
    } finally {
      setMinting(false);
    }
  };

  if (error) {
    return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;
  }

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
