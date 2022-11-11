import axios from "axios";

export async function subgraphQuery(query: string) {
  try {
    // Replace YOUR-SUBGRAPH-URL with the url of your subgraph

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

export const getUserStakes = (address: string) => {
  const query = `
    {
        stakingVaults(where:{
          user: "${address}"
        },orderBy:id,orderDirection:desc){
          stakingVault
          unlockTime
          redeemed
          value
        }
      }
    `;
  return subgraphQuery(query);
};
