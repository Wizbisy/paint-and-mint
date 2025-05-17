import PinataSDK from "@pinata/sdk";

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

export async function uploadToPinata(imageData: string, name: string) {
  const buffer = Buffer.from(imageData.split(",")[1], "base64");
  const result = await pinata.pinFileToIPFS(buffer, {
    pinataMetadata: { name },
    pinataOptions: { cidVersion: 0 },
  });
  return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
}