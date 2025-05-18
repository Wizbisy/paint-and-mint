import { NextResponse } from "next/server";
import PinataSDK from "@pinata/sdk";

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

export async function POST(request: Request) {
  try {
    console.log("Received upload request...");
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
      throw new Error("Pinata API keys are missing");
    }

    const { dataUrl, name } = await request.json();
    if (!dataUrl || !name) {
      throw new Error("dataUrl and name are required");
    }

    console.log("Processing upload with name:", name);
    const buffer = Buffer.from(dataUrl.split(",")[1], "base64");
    const response = await pinata.pinFileToIPFS({
      name,
      body: buffer,
      metadata: { name },
    });

    if (!response.IpfsHash) {
      throw new Error("Pinata upload failed: No IPFS hash returned");
    }

    console.log("Pinata upload response:", response);
    return NextResponse.json({ ipfsUrl: `https://ipfs.io/ipfs/${response.IpfsHash}` });
  } catch (error) {
    console.error("Pinata upload error:", error);
    return NextResponse.json({ error: `Failed to upload to Pinata: ${error.message}` }, { status: 500 });
  }
}

export const runtime = "nodejs";
