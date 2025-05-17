"use client";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    console.log("Layout mounted, checking Mini App context...");
    const url = new URL(window.location.href);
    const isMini =
      window.self !== window.top ||
      url.pathname.startsWith("/mini") ||
      url.searchParams.get("miniApp") === "true" ||
      url.searchParams.get("frame") === "miniapp";

    if (isMini) {
      console.log("Detected Mini App context, attempting to call SDK ready...");
      import("@farcaster/frame-sdk")
        .then(({ sdk }) => {
          sdk.actions.ready({ disableNativeGestures: false });
          console.log("Farcaster SDK ready called successfully");
        })
        .catch((err) => {
          console.error("Failed to load or call Farcaster SDK:", err);
        });
    } else {
      console.log("Not in Mini App context, skipping SDK ready");
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta
          name="fc:frame"
          content={JSON.stringify({
            version: "next",
            imageUrl: "https://paint-and-mint.vercel.app/og.png",
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
