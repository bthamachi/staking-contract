import CoinPurchaseForm from "./CoinPurchaseForm";
import GenericHeader from "./GenericHeader";

const CoinPurchase = () => {
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
