import { BigNumber, ethers } from "ethers"
import { TokenSeller } from "../contractTypes/types"



export const calculateTokenOrder = (basePrice: number, decimals: number, tokenOrder: number): ethers.BigNumber => {
    const decimalBN = ethers.BigNumber.from(10).pow(decimals)
    const tokenBasePrice = ethers.BigNumber.from(basePrice).mul(decimalBN)
    const cost = tokenBasePrice.mul(tokenOrder)

    return cost
}

export const calculateTokenAmount = (tokenDecimals: number, tokenOrder: number) => {
    const decimalBN = ethers.BigNumber.from(10).pow(tokenDecimals)
    return BigNumber.from(tokenOrder).mul(decimalBN)
}

export const purchaseCoin = (contract: TokenSeller, tokenOrderSize: BigNumber, tokenOrderValue: BigNumber) => {
    return contract.purchaseCoin(
        tokenOrderSize, { value: tokenOrderValue }
    )
}