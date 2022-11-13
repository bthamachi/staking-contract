import axios from "axios";
import { ethers } from "ethers";
import { getUserStakeReturnType, UserStake } from "../types/stake";
import { TOKEN_DECIMALS, TOKEN_TAX } from "../types/swr";

export async function subgraphQuery(query: string) {
  try {
    console.log(`Querying ${process.env.NEXT_PUBLIC_SUBGRAPH_URL}`);
    const response = await axios.post(process.env.NEXT_PUBLIC_SUBGRAPH_URL, {
      query,
    });
    if (response.data.errors) {
      console.error(response.data.errors);
      throw new Error(`Error making subgraph query ${response.data.errors}`);
    }
    return response.data.data;
  } catch (error) {
    console.error(error);
    //@ts-ignore
    throw new Error(`Could not query the subgraph ${error.message}`);
  }
}

export const getUserStakes = (
  address: string | undefined
): Promise<UserStake[]> => {
  console.log(`Inside here we initially get the value as ${address}`);
  if (!address) {
    return new Promise((resolve) => {
      return [];
    });
  }
  const query = `
    {
        stakingVaults(where:{
          user: "${address}"
        },orderBy:unlockTime,orderDirection:desc){
          stakingVault
          unlockTime
          redeemed
          value
        }
      }
    `;

  return subgraphQuery(query).then(
    ({ stakingVaults }: getUserStakeReturnType) => {
      return stakingVaults.map((item) => {
        const parsedBigNumber = ethers.BigNumber.from(item.value);
        const value = parsedBigNumber.mul(100 - TOKEN_TAX).div(100);
        return {
          ...item,
          value: ethers.utils.formatUnits(value, TOKEN_DECIMALS),
        };
      });
    }
  );
};
