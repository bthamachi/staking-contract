// src/context/state.js
import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { useWalletContext } from "./Wallet";

type SellerContextType = {
  protocolStakedValue: number;
  basePrice: number;
  tokenSellerLoading: boolean;
  userStakedAmount: number;
  userRedeemableAmount: number;
};

const SellerContext = createContext<SellerContextType>(null!);

//@ts-ignore
export function SellerWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  // This is the per-token price, calculated in Wei
  const [basePrice, setBasePrice] = useState<number>(0);
  const [protocolStakedValue, setProtocolStakedValue] = useState<number>(0);
  const [userRedeemableAmount, setUserRedeemableValue] = useState<number>(0);
  const [userStakedAmount, setUserStakedValue] = useState<number>(0);

  const { contractInterface, address, isConnected } = useWalletContext();

  useEffect(() => {
    updateSellerState();
  }, [address, isConnected]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateSellerState();
    }, 20000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const updateSellerState = () => {
    if (!isConnected) {
      return;
    }
    console.log("....Update Seller State");
    Promise.all([
      contractInterface?.taxableToken.decimals(),
      contractInterface?.tokenSeller.basePrice(),
      contractInterface?.taxableToken.balanceOf(
        contractInterface.tokenSeller.address
      ),
    ]).then(([decimals, basePriceRaw, stakedValue]) => {
      // Base Price is ~10 so not gonna break
      setBasePrice(basePriceRaw?.toNumber()!);
      // debugger;
      try {
        const parsedProtocolStakedValue = ethers.utils.formatUnits(
          stakedValue!,
          decimals!
        );

        setProtocolStakedValue(parseFloat(parsedProtocolStakedValue));
        if (loading) {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        debugger;
      }
    });
  };

  useEffect(() => {
    // We need this to run everytime we have an update in the user's address
    if (!address) {
      return;
    }

    Promise.all([
      contractInterface?.taxableToken.decimals(),
      contractInterface?.tokenSeller.getRedeemableAmount(),
      contractInterface?.tokenSeller.getStakedAmount(),
    ]).then(([decimals, userRedeemableValue, userStakedValue]) => {
      const parsedUserRedeemableValue = ethers.utils.formatUnits(
        userRedeemableValue!,
        decimals
      );
      const parsedUserstakedValue = ethers.utils.formatUnits(
        userStakedValue!,
        decimals
      );
      setUserRedeemableValue(parseFloat(parsedUserRedeemableValue));
      setUserStakedValue(parseFloat(parsedUserstakedValue));
    });
  }, [address]);

  let sharedState = {
    tokenSellerLoading: loading,
    basePrice: basePrice,
    protocolStakedValue,
    userRedeemableAmount,
    userStakedAmount,
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
