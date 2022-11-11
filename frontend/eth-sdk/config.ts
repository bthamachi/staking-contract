import type { EthSdkConfig } from "@dethcrypto/eth-sdk";

const config: EthSdkConfig = {
  contracts: {
    // We are looking to deploy types for the mumbai network
    polygonMumbai: {
      taxableToken: process.env.NEXT_PUBLIC_TAXABLE_TOKEN,
      tokenSeller: process.env.NEXT_PUBLIC_TOKEN_SELLER,
    },
  },
  rpc: {
    polygonMumbai: process.env.MUMBAI_RPC,
  },

  // We want to have our types live in the src/contractTypes folder
  outputPath: "./src/contractTypes/",
};

export default config;
