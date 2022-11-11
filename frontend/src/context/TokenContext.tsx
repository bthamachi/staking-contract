// src/context/state.js
import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { formatBNToNumber } from "../utils/chain";
import { useWalletContext } from "./Wallet";

type tokenContextType = {
  userBalance: number;
  tokenDecimals: number;
  tokenTax: number;
  tokenLoading: boolean;
  getBalance: (address: string) => Promise<number>;
};

const TokenContext = createContext<tokenContextType>(null!);

//@ts-ignore
export function TokenWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);
  const [tokenTax, setTokenTax] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<number>(0);

  const { contractInterface, address, isConnected } = useWalletContext();

  // Initial Load + Everytime address changes
  useEffect(() => {
    updateTokenState();
  }, [isConnected, address]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateTokenState();
    }, 20000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const updateTokenState = () => {
    if (!isConnected) {
      return;
    }
    console.log(".....Updating Token State");
    Promise.all([
      contractInterface?.taxableToken.decimals(),
      contractInterface?.taxableToken.balanceOf(address),
      contractInterface?.taxableToken.tax(),
    ]).then(([decimals, userBalance, tokenTax]) => {
      if (loading) {
        setLoading(false);
      }
      const parsedUserBalance = parseFloat(
        ethers.utils.formatUnits(userBalance!, decimals)
      );
      setTokenDecimals(decimals!);
      setUserBalance(parsedUserBalance);
      setTokenTax(tokenTax!);
    });
  };

  const getBalance = async (address: string) => {
    if (loading) {
      throw new Error("Awaiting details from contract");
    }
    const balance = await contractInterface?.taxableToken.balanceOf(address);
    return formatBNToNumber(balance!);
  };

  let sharedState = {
    tokenLoading: loading,
    userBalance,
    tokenTax,
    tokenDecimals,
    getBalance,
  };

  return (
    <TokenContext.Provider value={sharedState}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokenContext() {
  return useContext(TokenContext);
}
