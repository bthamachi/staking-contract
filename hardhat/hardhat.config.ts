require("dotenv").config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'


const { API_URL, PRIVATE_KEY, ETHERSCAN_KEY, MUMBAI_API_URL, POLYGONSCAN_KEY } = process.env;

module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: MUMBAI_API_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGONSCAN_KEY,
    },
  },

};