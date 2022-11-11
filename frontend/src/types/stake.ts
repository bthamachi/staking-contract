export type UserStake = {
  stakingVault: string;
  unlockTime: string;
  redeemed: boolean;
  value: string;
};

export type getUserStakeReturnType = {
  stakingVaults: UserStake[];
};
