export async function uploadToPinata(dataUrl: string, name: string): Promise<string> {
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }

  const data = await response.json();
  if (!data.ipfsUrl) {
    throw new Error("No IPFS URL returned");
  }
  return data.ipfsUrl;
}
