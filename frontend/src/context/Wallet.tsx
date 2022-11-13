import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { getPolygonMumbaiSdk, PolygonMumbaiSdk } from "../contractTypes";

type WalletContextType = {
  // This is a custom type provided by eth-sdk
  contractInterface: PolygonMumbaiSdk | undefined;
};

const WalletContext = createContext<WalletContextType>(null!);

//@ts-ignore
export function WalletWrapper({ children }) {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const router = useRouter();

  const [contractInterface, setContractInterface] = useState<PolygonMumbaiSdk>(
    null!
  );

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
      return;
    }

    if (!signer) {
      return;
    }

    try {
      const contracts = getPolygonMumbaiSdk(signer);

      setContractInterface(contracts);
    } catch (error) {
      console.log(error);
    }
    router.push("/app");
  }, [isConnected, address, signer]);

  let sharedState = {
    contractInterface,
  };

  return (
    <WalletContext.Provider value={sharedState}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
