import { ethers } from "hardhat";
import { BigNumber } from "ethers";

const decimals = 6
const decimalBN = BigNumber.from(10).pow(decimals)
const totalSupply = BigNumber.from(10000).mul(decimalBN)


async function main() {
  const TaxableCoinFactory = await ethers.getContractFactory("TaxableCoin")
  const TokenSellerFactory = await ethers.getContractFactory("TokenSeller")

  const TaxableCoin = await TaxableCoinFactory.deploy("Hamachi Coin", "HMC", decimals, totalSupply, 10)
  const TokenSeller = await TokenSellerFactory.deploy(TaxableCoin.address, 24 * 60 * 60, 10)

  await TaxableCoin.deployed()
  await TokenSeller.deployed()

  console.log(`Taxable coin deployed to ${TaxableCoin.address}`)
  console.log(`Token Seller deployed to ${TokenSeller.address}`)

  await sleep(60000);

  try {
    // Verify the contract after deploying
    await hre.run("verify:verify", {
      address: TaxableCoin.address,
      constructorArguments: ["Hamachi Coin", "HMC", decimals, totalSupply, 10],
    });
  } catch (err) {
    console.log(err)
  }



  await sleep(60000);

  await hre.run("verify:verify", {
    address: TokenSeller.address,
    constructorArguments: [TaxableCoin.address, 24 * 60 * 60, 10],
  });
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}