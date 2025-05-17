import { http, createConfig } from "wagmi";
import { farcasterFrame as miniAppConnector } from "@farcaster/frame-wagmi-connector";

const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    name: "MONAD",
    symbol: "MONAD",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
    public: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monvision.io" },
  },
};

export const config = createConfig({
  chains: [monadTestnet],
  transports: { [monadTestnet.id]: http() },
  connectors: [miniAppConnector()],
});