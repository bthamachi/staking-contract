// src/context/state.js
import { ethers } from "ethers";
import { createContext, useContext, useEffect } from "react";
import useSWR from "swr";
import { useAccount } from "wagmi";
import {
  PROTOCOL_TOTAL_STAKED,
  TOKEN_DECIMALS,
  TOKEN_TAX,
  USER_TOKEN_BALANCE,
} from "../types/swr";
import { useWalletContext } from "./Wallet";

type tokenContextType = {
  userBalance: number | undefined;
  protocolStakedValue: number | undefined;
  tokenDecimals: number;
  tokenTax: number;
  protocolStakedValueLoading: boolean;
  userbalanceValueLoading: boolean;
};

type tokenMetadata = {
  tax: number;
  decimals: number;
};

const TokenContext = createContext<tokenContextType>(null!);

//@ts-ignore
export function TokenWrapper({ children }) {
  const { contractInterface } = useWalletContext();
  const { address, isConnected } = useAccount();

  const getUserBalance = () => {
    if (!isConnected || !address) {
      return;
    }

    return contractInterface?.taxableToken.balanceOf(address).then((res) => {
      const userBalanceAsString = ethers.utils.formatUnits(res, TOKEN_DECIMALS);
      return parseFloat(userBalanceAsString);
    });
  };

  const getProtocolBalance = () => {
    if (!isConnected || !address) {
      return;
    }

    return contractInterface?.taxableToken
      .balanceOf(process.env.NEXT_PUBLIC_TOKEN_SELLER)
      .then((res) => {
        const protocolBalanceAsString = ethers.utils.formatUnits(
          res,
          TOKEN_DECIMALS
        );
        return parseFloat(protocolBalanceAsString);
      });
  };

  const {
    data: userBalance,
    error: userBalanceError,
    mutate: updateUserBalance,
  } = useSWR(USER_TOKEN_BALANCE, getUserBalance);

  const {
    data: protocolBalance,
    error: protocolBalanceError,
    mutate: updateProtocolBalance,
  } = useSWR(PROTOCOL_TOTAL_STAKED, getProtocolBalance);

  useEffect(() => {
    if (!contractInterface) {
      return;
    }
    updateUserBalance();
    updateProtocolBalance();
  }, [contractInterface]);

  let sharedState = {
    tokenDecimals: TOKEN_DECIMALS,
    tokenTax: TOKEN_TAX,
    protocolStakedValue: protocolBalance,
    userBalance: userBalance,
    protocolStakedValueLoading: !protocolBalance && !protocolBalanceError,
    userbalanceValueLoading: userBalance == null && !userBalanceError,
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
