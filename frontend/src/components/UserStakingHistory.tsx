import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTokenContext } from "../context/TokenContext";
import { useWalletContext } from "../context/Wallet";
import { getUserStakes } from "../utils/graph";
import GenericHeader from "./GenericHeader";
import UserStake from "./UserStake";

const UserStakingHistory = () => {
  const { address, isConnected, contractInterface } = useWalletContext();
  const { tokenDecimals, tokenLoading } = useTokenContext();
  const [userStakes, setUserStakes] = useState([]);

  useEffect(() => {
    if (!isConnected || tokenLoading) {
      return;
    }
    getUserStakes(address).then((res) => {
      setUserStakes(
        res.stakingVaults.map((item) => {
          return {
            stakingVaultAddr: item.stakingVault,
            unlockTime: item.unlockTime,
            redeemed: item.redeemed,
            value: ethers.utils
              .formatUnits(item.value, tokenDecimals)
              .toString(),
          };
        })
      );
    });
  }, [address, tokenLoading]);

  const redeemUserStakes = () => {
    contractInterface?.tokenSeller
      .redeemAllStakes()
      .then((res) => {
        toast.success("Redeeming tokens now...");
      })
      .catch((err) => {
        toast.warning(`Error Encountered of ${err}`);
      });
  };

  return (
    <div className="mt-10 bg-white shadow sm:rounded-lg px-10 py-5 sm:p-6">
      <div className="flex justify-between items-center w-100">
        <GenericHeader text="Staking History" />
        <button
          className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => redeemUserStakes()}
        >
          Redeem Staked Coins
        </button>
      </div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 py-10 mb-10"
      >
        {userStakes.map((item) => {
          return (
            <UserStake
              stakingVaultAddr={item.stakingVaultAddr}
              unlockTime={item.unlockTime}
              redeemed={item.redeemed}
              value={item.value}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default UserStakingHistory;
