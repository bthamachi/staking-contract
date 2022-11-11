import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from 'hardhat';
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber } from "ethers";
import { TaxableCoin, TaxableCoin__factory, TokenSeller, TokenSeller__factory } from "../typechain-types";


const decimals = 18
const decimalBN = BigNumber.from(10).pow(decimals)
const totalSupply = BigNumber.from(10000).mul(decimalBN)

//10 Wei per token ( ~18 decimal places so that means it's 1 Eth for each token)
const basePrice = 10

// Vesting is set at one day
const vestingDuration = 60 * 60 * 24

describe("TokenSeller", function () {

    let HamachiToken: TaxableCoin
    let TokenSeller: TokenSeller

    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addr3: SignerWithAddress;
    let addr4: SignerWithAddress
    let addrs: SignerWithAddress[];

    let beneficiary: SignerWithAddress;

    beforeEach(async function () {
        // Provision Addresses first
        [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();

        // Create Contract Interfaces
        const HamachiTokenFactory: TaxableCoin__factory = await ethers.getContractFactory(
            "TaxableCoin", owner
        )
        const TokenSellerFactory: TokenSeller__factory = await ethers.getContractFactory("TokenSeller", owner);

        //Set Constants

        beneficiary = addr1


        //Deploy Contracts
        HamachiToken = await HamachiTokenFactory.deploy(
            "Hamachi Token",
            "HMC",
            18,
            totalSupply,
            2
        )

        TokenSeller = await TokenSellerFactory.deploy(HamachiToken.address, vestingDuration, basePrice)
    });

    describe("Deployment", async function () {
        it("should throw an error when users try to purchase coins before its funded", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)
            // Try to buy 4 tokens
            await expect(TokenSeller.connect(addr1).purchaseCoin(
                tokenAmount, { from: addr1.address, value: tokenPrice }
            )).to.be.rejectedWith("Token Seller has no more tokens to sell")
        })
    })

    describe("Owner withdrawls", async function () {
        let expectedBalanceOfContract: ethers.BigNumber;
        beforeEach(async function () {
            // We transfer just twenty tokens over to the token seller
            await HamachiToken.transfer(TokenSeller.address, decimalBN.mul(20))
            expectedBalanceOfContract = await HamachiToken.estimateFinalTransfer(decimalBN.mul(20))
        })

        it("should only allow the owner to call the withdrawal functions", async function () {
            await expect(TokenSeller.connect(addr2).withdrawAllEth()).to.be.revertedWith("Ownable: caller is not the owner")
            await expect(TokenSeller.connect(addr2).withdrawAllRewardToken()).to.be.revertedWith("Ownable: caller is not the owner")
            await expect(TokenSeller.connect(addr2).withdrawUnusedRewardToken()).to.be.revertedWith("Ownable: caller is not the owner")
        })

        it("should allow the owner to withdraw all the eth in the contract", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)
            const timeStep = Math.floor(vestingDuration / 4)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })
            await TokenSeller.connect(addr2).purchaseCoin(tokenAmount, { from: addr2.address, value: tokenPrice })
            await TokenSeller.connect(addr3).purchaseCoin(tokenAmount, { from: addr3.address, value: tokenPrice })

            const contractEth = await TokenSeller.provider.getBalance(TokenSeller.address)

            expect(await TokenSeller.withdrawAllEth()).to.changeEtherBalance(owner, contractEth)
        })


        it("should allow the owner to withdraw the remainder of the reward tokens in the contract without blacklisting users", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)
            const timeStep = Math.floor(vestingDuration / 4)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })
            await TokenSeller.connect(addr2).purchaseCoin(tokenAmount, { from: addr2.address, value: tokenPrice })
            await TokenSeller.connect(addr3).purchaseCoin(tokenAmount, { from: addr3.address, value: tokenPrice })

            const remainingTokens = await HamachiToken.balanceOf(TokenSeller.address)
            const transferedTokens = await HamachiToken.estimateFinalTransfer(remainingTokens)

            const originalOwnerBalance = await HamachiToken.balanceOf(owner.address)

            await TokenSeller.withdrawUnusedRewardToken()

            expect(await HamachiToken.balanceOf(owner.address)).to.be.equal(
                originalOwnerBalance.add(transferedTokens)
            )
        })

        it("should allow the owner to blacklist every single user and extract staked funds", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)
            const timeStep = Math.floor(vestingDuration / 4)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })
            await TokenSeller.connect(addr2).purchaseCoin(tokenAmount, { from: addr2.address, value: tokenPrice })
            await TokenSeller.connect(addr3).purchaseCoin(tokenAmount, { from: addr3.address, value: tokenPrice })

            const estimatedStakedValueaddr2 = await HamachiToken.estimateFinalTransfer(await TokenSeller.connect(addr2).getStakedAmount())
            const estimatedStakedValueaddr3 = await HamachiToken.estimateFinalTransfer(await TokenSeller.connect(addr3).getStakedAmount())
            const estimatedStakedValueaddr4 = await HamachiToken.estimateFinalTransfer(await TokenSeller.connect(addr4).getStakedAmount())

            const contractValue = await HamachiToken.estimateFinalTransfer(
                await HamachiToken.balanceOf(TokenSeller.address)
            )

            const existingOwnerBalance = await HamachiToken.balanceOf(owner.address)

            await TokenSeller.withdrawAllRewardToken()

            expect(await HamachiToken.balanceOf(owner.address)).to.be.equal(
                existingOwnerBalance
                    .add(
                        estimatedStakedValueaddr2
                    )
                    .add(
                        estimatedStakedValueaddr3
                    )
                    .add(
                        estimatedStakedValueaddr4
                    )
                    .add(
                        contractValue
                    )
            )
        })
    })

    describe("Coin Purchase", function () {

        let expectedBalanceOfContract: ethers.BigNumber;
        beforeEach(async function () {
            // We transfer just twenty tokens over to the token seller
            await HamachiToken.transfer(TokenSeller.address, decimalBN.mul(20))
            expectedBalanceOfContract = await HamachiToken.estimateFinalTransfer(decimalBN.mul(20))
        })
        it("should throw an error if user has not added enough eth in the transaction", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)
            // Try to buy 4 tokens
            await expect(TokenSeller.connect(addr1).purchaseCoin(
                tokenAmount, { from: addr1.address, value: tokenPrice.div(2) }
            )).to.be.rejectedWith("Insufficient eth provided to purchase token")
        })

        it("should try to fill as much of the token order as it can with the user, pocketing the rest", async function () {
            const tokenAmount = decimalBN.mul(24)
            const tokenPrice = tokenAmount.mul(basePrice)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(expectedBalanceOfContract)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            expect(await TokenSeller.connect(addr1).purchaseCoin(tokenAmount, { from: addr1.address, value: tokenPrice })).to.emit(TokenSeller, "CoinStaked")

            expect(await TokenSeller.connect(addr1).getStakedAmount()).to.be.equal(expectedTransferedTokens)

        })

        it("should allow users to purchase coins once the Token Seller has been funded", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr1).purchaseCoin(tokenAmount, { from: addr1.address, value: tokenPrice })

            expect(await TokenSeller.connect(addr1).getStakedAmount()).to.be.equal(expectedTransferedTokens)
        })
    })

    describe("Blacklist", function () {
        let expectedBalanceOfContract: ethers.BigNumber;
        beforeEach(async function () {
            // We transfer just twenty tokens over to the token seller
            await HamachiToken.transfer(TokenSeller.address, decimalBN.mul(20))
            expectedBalanceOfContract = await HamachiToken.estimateFinalTransfer(decimalBN.mul(20))
        })
        it("should allow the contract owner to blacklist a user and retrieve all the original funds locked up in a single stake", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })

            const currContractBalance = await HamachiToken.balanceOf(TokenSeller.address)

            expect(await TokenSeller.connect(addr4).getStakedAmount()).to.be.equal(expectedTransferedTokens);

            await TokenSeller.blacklistUser(addr4.address);

            await expect(TokenSeller.connect(addr4).getStakedAmount()).to.be.rejectedWith("User is blacklisted from contract");
            expect(await HamachiToken.balanceOf(TokenSeller.address)).to.be.equal(
                currContractBalance.add(expectedTransferedTokens)
            )
        })

        it("should allow the contract owner to blacklist a user and retrieve funds locked up in multiple stakes", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)
            const timeStep = Math.floor(vestingDuration / 4)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })

            await time.increase(timeStep)

            await TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })

            await time.increase(timeStep)

            await TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })

            await time.increase(timeStep)

            const currContractBalance = await HamachiToken.balanceOf(TokenSeller.address)

            expect(await TokenSeller.connect(addr4).getStakedAmount()).to.be.equal(expectedTransferedTokens.mul(3));

            await TokenSeller.blacklistUser(addr4.address);

            await expect(TokenSeller.connect(addr4).getStakedAmount()).to.be.rejectedWith("User is blacklisted from contract");
            expect(await HamachiToken.balanceOf(TokenSeller.address)).to.be.equal(
                currContractBalance.add(expectedTransferedTokens.mul(3))
            )
        })

        it("should prevent the user from performing any other action if he has been blacklisted", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)
            const timeStep = Math.floor(vestingDuration / 4)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })
            expect(await TokenSeller.connect(addr4).getStakedAmount()).to.be.equal(expectedTransferedTokens);

            await TokenSeller.blacklistUser(addr4.address);

            await expect(TokenSeller.connect(addr4).getStakedAmount()).to.be.rejectedWith("User is blacklisted from contract")
            await expect(TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })).to.be.rejectedWith("User is blacklisted from contract")

        })

        it("should allow users to perform any actions he previously could once removed from blacklist", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)
            const timeStep = Math.floor(vestingDuration / 4)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })
            expect(await TokenSeller.connect(addr4).getStakedAmount()).to.be.equal(expectedTransferedTokens);

            await TokenSeller.blacklistUser(addr4.address);

            await expect(TokenSeller.connect(addr4).getStakedAmount()).to.be.rejectedWith("User is blacklisted from contract")
            await expect(TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })).to.be.rejectedWith("User is blacklisted from contract")

            await TokenSeller.removeUserFromBlacklist(addr4.address);

            expect(await TokenSeller.connect(addr4).getStakedAmount()).to.be.equal(0);
            await TokenSeller.connect(addr4).purchaseCoin(tokenAmount, { from: addr4.address, value: tokenPrice })
            expect(await TokenSeller.connect(addr4).getStakedAmount()).to.be.equal(expectedTransferedTokens);

        })
    })

    describe("Staking", function () {
        let expectedBalanceOfContract: ethers.BigNumber;
        beforeEach(async function () {
            // We transfer just twenty tokens over to the token seller
            await HamachiToken.transfer(TokenSeller.address, decimalBN.mul(20))
            expectedBalanceOfContract = await HamachiToken.estimateFinalTransfer(decimalBN.mul(20))
        })

        it("should accurately calculate the total staked amount for a single transaction", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)

            await TokenSeller.connect(addr1).purchaseCoin(tokenAmount, { from: addr1.address, value: tokenPrice })

            expect(await TokenSeller.totalStaked()).to.be.equal(expectedVestingAmount);

            await time.increase(vestingDuration)

            await TokenSeller.connect(addr1).redeemAllStakes();

            expect(await TokenSeller.totalStaked()).to.be.equal(0);
        })

        it("should accurately calculate the total staked amount for multiple transactions", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)

            await TokenSeller.connect(addr1).purchaseCoin(tokenAmount, { from: addr1.address, value: tokenPrice })

            expect(await TokenSeller.totalStaked()).to.be.equal(expectedVestingAmount);

            await time.increase(vestingDuration)

            await TokenSeller.connect(addr2).purchaseCoin(tokenAmount, { from: addr2.address, value: tokenPrice })

            await TokenSeller.connect(addr1).redeemAllStakes();

            expect(await TokenSeller.totalStaked()).to.be.equal(expectedVestingAmount);

            await time.increase(vestingDuration)

            await TokenSeller.connect(addr2).redeemAllStakes()

            expect(await TokenSeller.totalStaked()).to.be.equal(0);


        })


        it("should display the right staked amount", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr1).purchaseCoin(tokenAmount, { from: addr1.address, value: tokenPrice })


            expect(await TokenSeller.connect(addr1).getStakedAmount()).to.be.equal(expectedTransferedTokens)
        })

        it("should display the right staked amount for two vaults created at different times", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)
            const halfVestingDuration = Math.floor(vestingDuration / 2)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr1).purchaseCoin(tokenAmount, { from: addr1.address, value: tokenPrice })

            await time.increase(halfVestingDuration);

            expect(await TokenSeller.connect(addr1).getStakedAmount()).to.be.equal(expectedTransferedTokens)

            await TokenSeller.connect(addr1).purchaseCoin(tokenAmount, { from: addr1.address, value: tokenPrice })

            expect(await TokenSeller.connect(addr1).getStakedAmount()).to.be.equal(expectedTransferedTokens.mul(2))

            await time.increase(halfVestingDuration);

            await TokenSeller.connect(addr1).redeemAllStakes()

            expect(await TokenSeller.connect(addr1).getStakedAmount()).to.be.equal(expectedTransferedTokens)

            await time.increase(halfVestingDuration);

            await TokenSeller.connect(addr1).redeemAllStakes()
            expect(await TokenSeller.connect(addr1).getStakedAmount()).to.be.equal(0)


            expect(await HamachiToken.balanceOf(addr1.address)).to.be.equal(
                expectedTransferedTokens.mul(2)
            )


        })

    })

    describe("Redemption", function () {
        let expectedBalanceOfContract: ethers.BigNumber;
        beforeEach(async function () {
            // We transfer just twenty tokens over to the token seller
            await HamachiToken.transfer(TokenSeller.address, decimalBN.mul(20))
            expectedBalanceOfContract = await HamachiToken.estimateFinalTransfer(decimalBN.mul(20))
        })

        it("should display the right redeemable amount once vesting periods are over for a single vest", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr1).purchaseCoin(tokenAmount, { from: addr1.address, value: tokenPrice })

            expect(await TokenSeller.connect(addr1).getRedeemableAmount()).to.be.equal(0)

            await time.increase(vestingDuration);

            expect(await TokenSeller.connect(addr1).getRedeemableAmount()).to.be.equal(expectedTransferedTokens)
        })

        it("should allocate the reward coin to the user once he calls redeemAllStakes()", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr1).purchaseCoin(tokenAmount, { from: addr1.address, value: tokenPrice })
            await time.increase(vestingDuration)

            await TokenSeller.connect(addr1).redeemAllStakes()

            expect(await HamachiToken.balanceOf(addr1.address)).to.be.equal(
                expectedTransferedTokens
            )
        })

        it("should display the right redeemable amount once vesting periods are over for two vesting vaults that are created at different times", async function () {
            const tokenAmount = decimalBN.mul(4)
            const tokenPrice = tokenAmount.mul(basePrice)
            const halfVestingDuration = Math.floor(vestingDuration / 2)

            const expectedVestingAmount = await HamachiToken.estimateFinalTransfer(tokenAmount)
            const expectedTransferedTokens = await HamachiToken.estimateFinalTransfer(expectedVestingAmount)

            await TokenSeller.connect(addr1).purchaseCoin(tokenAmount, { from: addr1.address, value: tokenPrice })

            expect(await TokenSeller.connect(addr1).getRedeemableAmount()).to.be.equal(0)

            await time.increase(halfVestingDuration);

            await TokenSeller.connect(addr1).purchaseCoin(tokenAmount, { from: addr1.address, value: tokenPrice });

            await time.increase(halfVestingDuration);

            expect(await TokenSeller.connect(addr1).getRedeemableAmount()).to.be.equal(expectedTransferedTokens)

            await time.increase(halfVestingDuration);

            expect(await TokenSeller.connect(addr1).getRedeemableAmount()).to.be.equal(expectedTransferedTokens.mul(2))

            await TokenSeller.connect(addr1).redeemAllStakes()

            expect(await HamachiToken.balanceOf(addr1.address)).to.be.equal(
                expectedTransferedTokens.mul(2)
            )
        })
    })
})
