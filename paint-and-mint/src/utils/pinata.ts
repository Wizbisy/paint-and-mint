import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
});

export async function uploadToPinata(imageData: string, name: string) {
  const blob = await fetch(imageData).then((res) => res.blob());
  const file = new File([blob], `${name}.png`, { type: "image/png" });
  const upload = await pinata.upload.file(file);
  return `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`;
}
