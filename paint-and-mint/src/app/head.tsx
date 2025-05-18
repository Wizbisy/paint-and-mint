export default function Head() {
  return (
    <>
      <title>Paint & Mint</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
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
    </>
  );
}
