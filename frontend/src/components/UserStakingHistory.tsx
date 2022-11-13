import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import { useAccount } from "wagmi";
import { useWalletContext } from "../context/Wallet";
import { getUserStakes } from "../utils/graph";
import GenericHeader from "./GenericHeader";
import UserStakes from "./UserStakes";

const UserStakingHistory = () => {
  const { address } = useAccount();
  const { contractInterface } = useWalletContext();

  const [loading, setLoading] = useState(true);
  const [onlyStaked, setOnlyStaked] = useState(false);

  const {
    data: userStakes,
    error: userStakesError,
    mutate: updateUserStakes,
  } = useSWR([address], getUserStakes);

  useEffect(() => {
    if (!contractInterface) {
      return;
    }
    updateUserStakes();
  }, [contractInterface]);

  const redeemUserStakes = () => {
    contractInterface?.tokenSeller
      .redeemAllStakes()
      .then((res) => {
        toast.success("Redeeming tokens now...");
      })
      .catch((err) => {
        toast.warning(`Error Encountered of ${err}`);
      });

    contractInterface?.tokenSeller.on("CoinRedeemed", function (block) {
      updateUserStakes();
      mutate([address]);
    });
  };

  return (
    <div className="mt-10 bg-white shadow sm:rounded-lg px-10 py-5 sm:p-6">
      <div className="flex items-center justify-between">
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
      <UserStakes
        userStakes={userStakes}
        userStakesError={userStakesError}
        onlyStaked={onlyStaked}
      />
    </div>
  );
};

export default UserStakingHistory;
