import { ClipLoader } from "react-spinners";
import { useSellerContext } from "../context/SellerContext";
import { useTokenContext } from "../context/TokenContext";
import CoinPurchaseForm from "./CoinPurchaseForm";
import GenericHeader from "./GenericHeader";

const CoinPurchase = () => {
  const { tokenLoading } = useTokenContext();
  const { tokenSellerLoading } = useSellerContext();

  if (tokenLoading || tokenSellerLoading) {
    return (
      <div className="mt-10 py-4 flex items-center justify-center h-40 bg-white shadow sm:rounded-lg">
        <ClipLoader />
      </div>
    );
  }

  return (
    <div className="mt-10 shadow grid bg-white sm:rounded-lg">
      <div className="px-10 py-5 sm:p-6 ">
        <GenericHeader text="Purchase Coins" />
        <CoinPurchaseForm />
      </div>
    </div>
  );
};

export default CoinPurchase;
