import PinataSDK from "@pinata/sdk";

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

export async function uploadToPinata(dataUrl: string, name: string): Promise<string> {
  try {
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
      throw new Error("Pinata API keys are missing");
    }
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
    return `https://ipfs.io/ipfs/${response.IpfsHash}`;
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw new Error(`Failed to upload to Pinata: ${error}`);
  }
}
