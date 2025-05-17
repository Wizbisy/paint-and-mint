'use client';
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import("@farcaster/frame-sdk")
      .then(({ sdk }) => {
        if (window.self !== window.top) {
          sdk.actions.ready();
          console.log("Farcaster SDK ready called");
        }
      })
      .catch((err) => console.error("Failed to load Farcaster SDK:", err));
  }, []);

  return (
    <html lang="en">
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:button:1" content="Draw Now" />
        <meta
          property="fc:frame:button:1:url"
          content="https://paint-and-mint.vercel.app"
        />
        <meta
          property="fc:frame:button:1:splashImageUrl"
          content="https://paint-and-mint.vercel.app/splash.png"
        />
        <meta
          property="fc:frame:button:1:splashBackgroundColor"
          content="#FFFFFF"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

