import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useTokenContext } from "../context/TokenContext";
import { useWalletContext } from "../context/Wallet";
import { UserStake } from "../types/stake";
import { getUserStakes } from "../utils/graph";
import GenericHeader from "./GenericHeader";
import UserStakeComponent from "./UserStakeComponent";

const UserStakingHistory = () => {
  const { address, isConnected, contractInterface } = useWalletContext();
  const { tokenDecimals, tokenLoading, tokenTax } = useTokenContext();
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyStaked, setOnlyStaked] = useState(false);

  useEffect(() => {
    if (!isConnected || tokenLoading || !tokenTax) {
      return;
    }
    getUserStakes(address).then(({ stakingVaults }) => {
      const parsedUserStakes = stakingVaults.map((item) => {
        const parsedBigNumber = ethers.BigNumber.from(item.value);
        const value = parsedBigNumber.mul(100 - tokenTax).div(100);
        return {
          ...item,
          value: ethers.utils.formatUnits(value, tokenDecimals),
        };
      });

      setUserStakes(parsedUserStakes);
      setLoading(false);
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
      <div className="flex items-center justify-between  w-100">
        <div className="flex flex-col">
          <GenericHeader text="Staking History" />
          <div className="relative flex items-start mt-4">
            <div className="flex h-5 items-center">
              <input
                id="candidates"
                aria-describedby="candidates-description"
                name="candidates"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 hover:cursor-pointer"
                onChange={() => setOnlyStaked(!onlyStaked)}
                defaultChecked={onlyStaked}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="candidates" className="font-medium text-gray-700">
                Staked View
              </label>
              <p id="candidates-description" className="text-gray-500">
                Only view Staked Coins
              </p>
            </div>
          </div>
        </div>

        <button
          className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => redeemUserStakes()}
        >
          Redeem Staked Coins
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center my-10">
          <p className="mr-4">Loading</p>
          <ClipLoader />
        </div>
      ) : (
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 py-10 mb-10"
        >
          {userStakes
            .filter((stake) => {
              if (onlyStaked) {
                return !stake.redeemed;
              }
              return true;
            })
            .map((stake) => {
              return (
                <UserStakeComponent stake={stake} key={stake.stakingVault} />
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default UserStakingHistory;
