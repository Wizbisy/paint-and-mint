"use client";
import { useEffect } from "react";
import { sdk } from "@farcaster/frame-sdk";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (window.self !== window.top) {
      try {
        sdk.actions.ready({ disableNativeGestures: false });
        console.log("Farcaster SDK ready called");
      } catch (err) {
        console.error("Failed to call Farcaster SDK ready:", err);
      }
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta
          name="fc:frame"
          content={JSON.stringify({
            version: "next",
            imageUrl: "https://paint-and-mint.vercel.app/preview.png",
            button: {
              title: "Draw Now",
              action: {
                type: "launch_frame",
                name: "Paint & Mint",
                url: "https://paint-and-mint.vercel.app",
                splashImageUrl: "https://paint-and-mint.vercel.app/splash.png",
                splashBackgroundColor: "#FFFFFF",
              },
            },
          })}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
