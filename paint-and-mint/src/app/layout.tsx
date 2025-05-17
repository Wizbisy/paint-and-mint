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
      url.pathname.startsWith("/mini") || url.searchParams.get("miniApp") === "true";
    if (isMini) {
      import("@farcaster/frame-sdk").then(({ sdk }) => {
        sdk.actions.ready();
      });
    }
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}