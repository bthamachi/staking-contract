// src/context/state.js
import { ethers } from "ethers";
import { createContext, useContext, useEffect } from "react";
import useSWR from "swr";
import { useAccount } from "wagmi";
import {
  CONTRACT_BASE_PRICE,
  CONTRACT_REDEEM_VALUE,
  CONTRACT_STAKED_VALUE,
  TOKEN_DECIMALS,
} from "../types/swr";
import { useWalletContext } from "./Wallet";

type SellerContextType = {
  basePrice: number | undefined;
  userRedeemableAmount: number | undefined;
  userStakedAmount: number | undefined;
  basePriceLoading: boolean;
  userRedeemableAmountLoading: boolean;
  userStakedAmountLoading: boolean;
  userRedeemableAmountError: any;
  basePriceError: any;
  userStakedAmountError: any;
  updateUserStakedAmount: () => void;
  updateUserRedeemableAmount: () => void;
};

const SellerContext = createContext<SellerContextType>(null!);

//@ts-ignore
export function SellerWrapper({ children }) {
  const { address, isConnected } = useAccount();
  const { contractInterface } = useWalletContext();

  const getUserStakedAmount = () => {
    if (!address || !isConnected) {
      return;
    }

    if (!contractInterface) {
      return;
    }

    return contractInterface.tokenSeller.getStakedAmount().then((res) => {
      return parseFloat(ethers.utils.formatUnits(res, TOKEN_DECIMALS));
    });
  };

  const getUserRedeemableAmount = () => {
    if (!address || !isConnected) {
      return;
    }

    if (!contractInterface) {
      return;
    }

    return contractInterface.tokenSeller.getRedeemableAmount().then((res) => {
      return parseFloat(ethers.utils.formatUnits(res, TOKEN_DECIMALS));
    });
  };

  const getBasePrice = () => {
    if (!address || !isConnected) {
      return;
    }

    if (!contractInterface) {
      return;
    }

    // Base Price is ~10 so will not throw an error
    return contractInterface.tokenSeller.basePrice().then((res) => {
      return res.toNumber();
    });
  };

  const {
    data: basePrice,
    error: basePriceError,
    mutate: updateBasePrice,
  } = useSWR(CONTRACT_BASE_PRICE, getBasePrice);
  const {
    data: userStakedAmount,
    error: userStakedAmountError,
    mutate: updateUserStakedAmount,
  } = useSWR(CONTRACT_STAKED_VALUE, getUserStakedAmount);

  const {
    data: userRedeemableAmount,
    error: userRedeemableAmountError,
    mutate: updateUserRedeemableAmount,
  } = useSWR(CONTRACT_REDEEM_VALUE, getUserRedeemableAmount);

  useEffect(() => {
    if (!contractInterface) {
      return;
    }

    updateUserRedeemableAmount();
    updateUserStakedAmount();
    updateBasePrice();
  }, [contractInterface]);

  let sharedState = {
    basePrice: basePrice,
    userRedeemableAmount: userRedeemableAmount,
    userStakedAmount: userStakedAmount,
    basePriceLoading: !basePrice && !basePriceError,
    userRedeemableAmountLoading:
      userRedeemableAmount == null && !userRedeemableAmountError,
    userStakedAmountLoading: userStakedAmount == null && !userStakedAmountError,
    basePriceError,
    userRedeemableAmountError,
    userStakedAmountError,

    updateUserStakedAmount,
    updateUserRedeemableAmount,
  };

  return (
    <SellerContext.Provider value={sharedState}>
      {children}
    </SellerContext.Provider>
  );
}

export function useSellerContext() {
  return useContext(SellerContext);
}
