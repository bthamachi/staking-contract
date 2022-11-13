declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_MUMBAI_RPC: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
      PWD: string;
      NEXT_PUBLIC_TAXABLE_TOKEN: `0x${string}`;
      NEXT_PUBLIC_TOKEN_SELLER: `0x${string}`;
      NEXT_PUBLIC_SUBGRAPH_URL: string;
      NEXT_PUBLIC_ALCHEMY_ID: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
