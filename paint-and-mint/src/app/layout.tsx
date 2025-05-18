"use client";

import { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "../config/wagmi";
import "./globals.css"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    console.log("Layout mounted, checking Mini App context...");
    const url = new URL(window.location.href);
    const isMini =
      window.self !== window.top ||
      url.pathname.startsWith("/mini") ||
      url.searchParams.get("miniApp") === "true" ||
      url.searchParams.get("frame") === "miniapp";

    if (isMini) {
      console.log("Detected Mini App context, loading SDK...");
      import("@farcaster/frame-sdk")
        .then(({ sdk }) => {
          sdk.actions.ready({ disableNativeGestures: false });
          console.log("Farcaster SDK ready called successfully");
        })
        .catch((err) => {
          console.error("Failed to load or call Farcaster SDK:", err);
        });
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  );
}
