import { useSellerContext } from "../context/SellerContext";
import { useTokenContext } from "../context/TokenContext";
import DataBox from "./DataBox";

const DataPoints = () => {
  const {
    userRedeemableAmount,
    userStakedAmount,
    userStakedAmountLoading,
    userRedeemableAmountLoading,
  } = useSellerContext();
  const {
    userBalance,
    protocolStakedValueLoading,
    userbalanceValueLoading,
    protocolStakedValue,
  } = useTokenContext();

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Last 30 days
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DataBox
          loading={protocolStakedValueLoading}
          name="Protocol Staked Value"
          stat={protocolStakedValue}
        />

        <DataBox
          loading={userStakedAmountLoading}
          name="User Staked Value"
          stat={userStakedAmount}
        />
        <DataBox
          loading={userRedeemableAmountLoading}
          name="User Redeemable Value"
          stat={userRedeemableAmount}
        />
        <DataBox
          loading={userbalanceValueLoading}
          name="User Token Balance"
          stat={userBalance}
        />
      </dl>
    </div>
  );
};

export default DataPoints;
