import { providers } from "ethers";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Web3Modal from "web3modal";
import { getPolygonMumbaiSdk, PolygonMumbaiSdk } from "../contractTypes";

type WalletContextType = {
  connectWallet: () => void;
  disconnectWallet: () => void;
  // This is a custom type provided by eth-sdk
  contractInterface: PolygonMumbaiSdk | undefined;
  isConnected: Boolean;
  address: string;
  updateUserAddress: (newAddress: string) => void;
};

const WalletContext = createContext<WalletContextType>(null!);

//@ts-ignore
export function WalletWrapper({ children }) {
  const [modal, setModal] = useState<Web3Modal>();
  const [sdk, setSdk] = useState<PolygonMumbaiSdk>();
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAdress] = useState<string>(null!);
  const router = useRouter();

  useEffect(() => {
    const modal = new Web3Modal({
      network: "mumbai",
    });
    setModal(modal);
  }, []);

  useEffect(() => {
    if (walletConnected) {
      router.push("/app");
    } else {
      router.push("/");
    }
  }, [walletConnected]);

  const connectWallet = async () => {
    if (!modal) {
      throw new Error("Modal must be initialised to connect wallet");
    }
    //Initialise Information
    const provider = await modal?.connect();

    const web3Provider = await new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const { chainId } = await web3Provider.getNetwork();
    const walletAddress = await signer.getAddress();
    const contracts = getPolygonMumbaiSdk(signer);

    if (chainId !== 80001) {
      toast.warning(
        "This app only runs on Mumbai's Network. Please switch to Mumbai"
      );
      return;
    }

    //Update State
    setSdk(contracts);
    setWalletConnected(true);
    setUserAdress(walletAddress);
  };

  const disconnectWallet = async () => {
    if (!modal) {
      throw new Error("Modal must be initialised to disconnect wallet");
    }
    await modal?.clearCachedProvider();
    setWalletConnected(false);
    setUserAdress("");
  };

  const updateUserAddress = (address: string) => {
    setUserAdress(address);
  };

  let sharedState = {
    connectWallet,
    isConnected: walletConnected,
    disconnectWallet,
    contractInterface: sdk,
    address: userAddress,
    updateUserAddress,
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
