import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSellerContext } from "../context/SellerContext";
import { useTokenContext } from "../context/TokenContext";
import { useWalletContext } from "../context/Wallet";
import { calculateTokenAmount, calculateTokenOrder } from "../utils/seller";

const CoinPurchaseForm = () => {
  const [tokenOrderSize, updateTokenOrderSize] = useState<string>("");

  const { tokenDecimals } = useTokenContext();
  const { basePrice, updateSellerState } = useSellerContext();
  const { contractInterface } = useWalletContext();

  const purchaseToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const tokenOrder = parseFloat(tokenOrderSize);
      const totalCost = calculateTokenOrder(
        basePrice,
        tokenDecimals,
        tokenOrder
      );
      const totalAmount = calculateTokenAmount(tokenDecimals, tokenOrder);
      contractInterface?.tokenSeller
        .purchaseCoin(totalAmount, { value: totalCost })
        .then((_) => {
          toast.success(
            `Succesfully sent in an order to purchase ${tokenOrder.toFixed(
              2
            )} tokens`
          );
        })
        .catch((err) => {
          toast.error(err);
        });

      contractInterface?.tokenSeller.on("CoinStaked", function (block) {
        toast(`Succesfully Purchased ${tokenOrder.toFixed(2)} Tokens`);
        updateSellerState();
      });
    } catch {
      toast.warning("Invalid Token Amount. Please try a valid sum.");
    }
  };

  return (
    <form
      onSubmit={(e) => purchaseToken(e)}
      className="mt-5 sm:flex sm:items-center"
    >
      <div className="w-full sm:max-w-xs">
        <label htmlFor="tokens" className="sr-only"></label>
        <input
          type="text"
          name="Token Quantity"
          value={tokenOrderSize}
          onChange={(e) => updateTokenOrderSize(e.target.value)}
          className="block border px-2 py-4 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="0"
        />
      </div>
      <button
        type="submit"
        className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Purchase Now
      </button>
    </form>
  );
};

export default CoinPurchaseForm;
