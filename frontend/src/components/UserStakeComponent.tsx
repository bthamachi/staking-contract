import { UserStake } from "../types/stake";
import { formatAddressToDisplay } from "../utils/chain";
import CountdownTimer from "./CountdownTimer";

type UserStakeProps = {
  stake: UserStake;
};

const UserStakeComponent = ({ stake }: UserStakeProps) => {
  const { stakingVault, redeemed, unlockTime, value } = stake;
  return (
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center  justify-between">
            <div className="flex flex-col">
              <h3 className="truncate text-sm font-medium text-gray-900">
                Stake ({formatAddressToDisplay(stakingVault)})
              </h3>

              <p className="mt-1 truncate text-sm text-gray-500">
                {parseFloat(value).toFixed(2)} HMC tokens
              </p>
            </div>
            {redeemed ? (
              <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Redeemed
              </span>
            ) : (
              <div className="flex flex-col items-center">
                <CountdownTimer
                  unlockTimestamp={parseInt(unlockTime)}
                  redeemed={redeemed}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default UserStakeComponent;
