import { useSellerContext } from "../context/SellerContext";
import { useTokenContext } from "../context/TokenContext";
import DataBox from "./DataBox";

const DataPoints = () => {
  const {
    userRedeemableAmount,
    userStakedAmount,
    protocolStakedValue,
    tokenSellerLoading,
  } = useSellerContext();
  const { userBalance, tokenLoading } = useTokenContext();

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Last 30 days
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DataBox
          loading={tokenSellerLoading}
          name="Protocol Staked Value"
          stat={protocolStakedValue.toString()}
        />
        <DataBox
          loading={tokenSellerLoading}
          name="User Staked Value"
          stat={userStakedAmount.toString()}
        />
        <DataBox
          loading={tokenSellerLoading}
          name="User Redeemable Value"
          stat={userRedeemableAmount.toString()}
        />
        <DataBox
          loading={tokenLoading}
          name="User Token Balance"
          stat={userBalance.toString()}
        />
      </dl>
    </div>
  );
};

export default DataPoints;
