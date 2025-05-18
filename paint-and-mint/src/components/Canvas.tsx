"use client";
import { useEffect, useRef, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { uploadToPinata } from "../utils/pinata";
import { config } from "../config/wagmi";
import { ArtNFTABI } from "../types";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { address, isConnected } = useAccount({ config });
  const { writeContract, isPending, error: writeError } = useWriteContract();
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    console.log("Canvas component mounted...");
    try {
      if (!process.env.NEXT_PUBLIC_ART_NFT_CONTRACT_ADDRESS) {
        throw new Error("Environment variable NEXT_PUBLIC_ART_NFT_CONTRACT_ADDRESS is missing");
      }
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas element not found");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not found");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      console.log("Canvas initialized successfully");

      const startDrawing = (e: MouseEvent) => {
        setIsDrawing(true);
        draw(e);
      };
      const stopDrawing = () => setIsDrawing(false);
      const draw = (e: MouseEvent) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx!.beginPath();
        ctx!.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = "black";
        ctx!.fill();
      };

      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mouseup", stopDrawing);
      canvas.addEventListener("mousemove", draw);
      return () => {
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mouseup", stopDrawing);
        canvas.removeEventListener("mousemove", draw);
      };
    } catch (err) {
      console.error("Canvas initialization failed:", err);
      setError(`Failed to initialize canvas: ${err.message}`);
    }
  }, [isDrawing]);

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
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas element not found");
      const dataUrl = canvas.toDataURL("image/png");
      console.log("Uploading to Pinata via API...");
      const ipfsUrl = await uploadToPinata(dataUrl, `Artwork-${Date.now()}`);
      console.log("Pinata upload successful, IPFS URL:", ipfsUrl);
      const contractAddress = process.env.NEXT_PUBLIC_ART_NFT_CONTRACT_ADDRESS;
      if (!contractAddress) throw new Error("Contract address is missing");
      console.log("Minting NFT to contract:", contractAddress);
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: ArtNFTABI,
        functionName: "mintTo",
        args: [address, ipfsUrl],
      });
      console.log("Mint transaction sent successfully");
      alert("NFT minted successfully!");
    } catch (error) {
      console.error("Minting failed:", error);
      setError(`Minting failed: ${error.message || error}`);
    } finally {
      setMinting(false);
    }
  };

  if (error) {
    return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;
  }

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: "1px solid black" }} />
      <button onClick={handleMint} disabled={minting || isPending || !isConnected}>
        {minting || isPending ? "Minting..." : "Mint Artwork"}
      </button>
    </div>
  );
};

export default Canvas;
