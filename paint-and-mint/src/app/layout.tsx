"use client";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const url = new URL(window.location.href);
    const isMini =
      url.pathname.startsWith("/mini") ||
      url.searchParams.get("miniApp") === "true" ||
      url.searchParams.get("frame") === "miniapp";

    if (isMini) {
      import("@farcaster/frame-sdk")
        .then(({ sdk }) => {
          sdk.actions.ready({ disableNativeGestures: false });
          console.log("Farcaster SDK ready called");
        })
        .catch((err) => {
          console.error("Failed to load Farcaster SDK:", err);
        });
    }
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
