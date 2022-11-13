import { ClipLoader } from "react-spinners";
import { UserStake } from "../types/stake";
import UserStakeComponent from "./UserStakeComponent";

type UserStakesProps = {
  userStakes: undefined | UserStake[];
  userStakesError: any;
  onlyStaked: boolean;
};

const UserStakes = ({
  userStakes,
  userStakesError,
  onlyStaked,
}: UserStakesProps) => {
  if (userStakesError) {
    return <p>{userStakesError}</p>;
  }

  if (!userStakesError && !userStakes) {
    return (
      <div className="flex items-center justify-center my-10">
        <p className="mr-4">Loading</p>
        <ClipLoader />
      </div>
    );
  }

  if (!userStakes || userStakes.length == 0) {
    return (
      <div className="flex items-center justify-center my-10">
        <p className="mr-4">No staking history found</p>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 px-4 py-10 mb-10"
    >
      {userStakes
        .filter((stake) => {
          if (onlyStaked) {
            return !stake.redeemed;
          }
          return true;
        })
        .map((stake) => {
          return <UserStakeComponent stake={stake} key={stake.stakingVault} />;
        })}
    </ul>
  );
};

export default UserStakes;
