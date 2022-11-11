import { ethers } from 'ethers';

export const formatAddressToDisplay = (address: string) => {
    return `${address.slice(0, 5)}...${address.slice(address.length - 4, address.length)}`
}

export const formatTokenInCorrectDecimals = (value: ethers.BigNumber, decimals: number, precision = 4) => {
    if (!decimals || !value) {
        return ""
    }

    return ethers.utils.formatUnits(value, decimals)
}

export const formatBNToNumber = (BN: ethers.BigNumber) => {
    console.log("Parsing BN now of ")
    console.log(BN)
    return parseFloat(ethers.utils.formatUnits(BN, "ether"))
}