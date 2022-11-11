import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { time } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber } from "ethers";
import { TaxableCoin__factory, TaxableCoin, VestingVault, VestingVault__factory } from "../typechain-types";

const decimals = 18
const decimalBN = BigNumber.from(10).pow(decimals)
const totalSupply = BigNumber.from(10000).mul(decimalBN)

describe("Vesting Vault", function () {

    let HamachiToken: TaxableCoin
    let VestingVault: VestingVault;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress
    let addrs: SignerWithAddress[];

    let beneficiary: SignerWithAddress;


    beforeEach(async function () {
        // Provision Addresses first
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Create Contract Interfaces
        const HamachiTokenFactory: TaxableCoin__factory = await ethers.getContractFactory(
            "TaxableCoin", owner
        )
        const VestingVaultFactory: VestingVault__factory = await ethers.getContractFactory("VestingVault", owner);

        //Set Constants

        beneficiary = addr1


        //Deploy Contracts
        HamachiToken = await HamachiTokenFactory.deploy(
            "Hamachi Token",
            "HMC",
            18,
            totalSupply,
            10
        )
        VestingVault = await VestingVaultFactory.deploy(beneficiary.address)
    });

    describe("Deployment", function () {
        it("should be initialised with a set beneficiary", async function () {
            expect(await VestingVault.beneficiary()).to.equal(beneficiary.address)
            expect(await VestingVault.funded()).to.equal(false)
        })

        it("should throw an error when withdraw is called when initialised", async function () {
            await expect(VestingVault.withdraw()).to.be.rejectedWith("Vesting Vault has not been funded, please try again later")
        })

        it("should be owned by the person who deployed the contract", async function () {
            expect(await VestingVault.owner()).to.be.equal(owner.address)
        })
    })

    describe("Funding", function () {
        // Input Checks
        it("Should throw an error if owner sets a vesting duration of 0", async function () {
            await expect(VestingVault.fund(0, HamachiToken.address, 1000)).to.be.rejectedWith("Vesting Duration needs to be non-zero!")
        })

        it("Should throw an error if owner provides an invalid ERC-20 token address", async function () {
            await expect(VestingVault.fund(40, addr1.address, 1000)).to.be.rejected
        })


        // Functionality Checks
        it("should be funded with a set number amount of ERC-20 tokens", async function () {
            const vestingDuration = (10 ** 4) //this is in seconds
            const fundedAmount = 1000
            const expectedFundedAmount = await HamachiToken.estimateFinalTransfer(fundedAmount)

            await HamachiToken.approve(VestingVault.address, fundedAmount)
            await VestingVault.fund(vestingDuration, HamachiToken.address, fundedAmount)
            const addressBalance = await HamachiToken.balanceOf(VestingVault.address)
            expect(addressBalance).to.be.equal(expectedFundedAmount)
            expect(await VestingVault.funded()).to.be.true
            expect(await VestingVault.vestingVaultValue()).to.be.equal(expectedFundedAmount)
        })


    })
    describe("Withdrawal for pure ERC-20 Withdrawals", function () {
        it("should be disabled once the user blacklisted", async function () {
            const vestingDuration = (10 ** 4);
            const fundedAmount = 1000;
            await HamachiToken.approve(VestingVault.address, fundedAmount)
            await VestingVault.fund(vestingDuration, HamachiToken.address, fundedAmount)
            await VestingVault.blacklistBeneficiary();
            await expect(VestingVault.connect(beneficiary).withdraw()).to.be.rejectedWith("Owner has prematurely cancelled vesting and prohibited beneficiary from recieving funds")
        })

        it("should not able to call withdrawal before the vault is funded", async function () {
            await expect(VestingVault.withdraw()).to.be.rejectedWith("Vesting Vault has not been funded, please try again later")
        })

        it("should only allow the beneficiary to call the contract", async function () {
            const vestingDuration = (10 ** 4);
            const fundedAmount = 1000;
            await HamachiToken.approve(VestingVault.address, fundedAmount)
            await VestingVault.fund(vestingDuration, HamachiToken.address, fundedAmount)

            await expect(VestingVault.connect(addr2).withdraw()).to.be.rejectedWith("Only beneficiary can withdraw money from this contract")
        })
        it("Should prohibit beneficiary from being able to call withdrawal if not yet till unlock time", async function () {
            const vestingDuration = (10 ** 4);
            const fundedAmount = 1000;
            await HamachiToken.approve(VestingVault.address, fundedAmount)
            await VestingVault.fund(vestingDuration, HamachiToken.address, fundedAmount)

            await expect(VestingVault.connect(beneficiary).withdraw()).to.be.rejectedWith("Vesting duration has not been completed, please try again later")
        })

        it("should prohibit beneficiary from being able to call withdrawl if the owner of the contract has blacklisted the beneficiary", async function () {
            const vestingDuration = (10 ** 4);
            const fundedAmount = 1000;
            const estimatedFundingAmount = await HamachiToken.estimateFinalTransfer(fundedAmount)


            await HamachiToken.approve(VestingVault.address, fundedAmount)
            await VestingVault.fund(vestingDuration, HamachiToken.address, fundedAmount)



            const ownerBalance = await HamachiToken.balanceOf(owner.address);
            // Check that Owner gets back all his original ERC20 tokens
            expect(await HamachiToken.balanceOf(VestingVault.address)).to.be.equal(estimatedFundingAmount)
            await VestingVault.blacklistBeneficiary()
            expect(await HamachiToken.balanceOf(VestingVault.address)).to.be.equal(0)

            const estimatedTransferedAmount = await HamachiToken.estimateFinalTransfer(estimatedFundingAmount)

            expect(await HamachiToken.balanceOf(owner.address)).to.be.equal(
                ownerBalance.add(estimatedTransferedAmount)
            )

            // Ensure that beneficiary is unable to call
            await expect(VestingVault.connect(beneficiary).withdraw()).to.be.rejectedWith("Owner has prematurely cancelled vesting and prohibited beneficiary from recieving funds")


        })

        it("should only allow beneficiary to call withdrawal once. Subsequent attempts should throw an error", async function () {
            const vestingDuration = (10 ** 4);
            const fundedAmount = 1000;
            const estimatedFundingAmount = await HamachiToken.estimateFinalTransfer(fundedAmount)
            const estimatedFinalAmount = await HamachiToken.estimateFinalTransfer(estimatedFundingAmount)
            await HamachiToken.approve(VestingVault.address, fundedAmount)
            await VestingVault.fund(vestingDuration, HamachiToken.address, fundedAmount)

            await time.increase(vestingDuration);
            await VestingVault.connect(beneficiary).withdraw()
            expect(await HamachiToken.balanceOf(beneficiary.address)).to.be.equal(estimatedFinalAmount);
            expect(expect(await HamachiToken.balanceOf(VestingVault.address)).to.be.equal(0));

            await expect(VestingVault.connect(beneficiary).withdraw()).to.be.rejectedWith(
                "Vault's vested tokens have already been redeemed"
            )
        })


        it("should allow beneficiary to call withdrawl and call his ERC-20 if the exact amount of unlock time has passed", async function () {
            const vestingDuration = (10 ** 4);
            const fundedAmount = 1000;
            const estimatedFundingAmount = await HamachiToken.estimateFinalTransfer(fundedAmount)
            const estimatedFinalAmount = await HamachiToken.estimateFinalTransfer(estimatedFundingAmount)

            await HamachiToken.approve(VestingVault.address, fundedAmount)
            await VestingVault.fund(vestingDuration, HamachiToken.address, fundedAmount)

            await time.increase(vestingDuration);
            await VestingVault.connect(beneficiary).withdraw()
            expect(await HamachiToken.balanceOf(beneficiary.address)).to.be.equal(estimatedFinalAmount);
            expect(expect(await HamachiToken.balanceOf(VestingVault.address)).to.be.equal(0));
        })

        it("should allow beneficiary to call withdrawl and recieve his ERC-20 if more time than the specified unlock time has passed", async function () {
            const vestingDuration = (10 ** 4);
            const fundedAmount = 1000;
            const estimatedFundingAmount = await HamachiToken.estimateFinalTransfer(fundedAmount)
            const estimatedFinalAmount = await HamachiToken.estimateFinalTransfer(estimatedFundingAmount)

            await HamachiToken.approve(VestingVault.address, fundedAmount)
            await VestingVault.fund(vestingDuration, HamachiToken.address, fundedAmount)

            await time.increase(vestingDuration * 2);
            await VestingVault.connect(beneficiary).withdraw()
            expect(await HamachiToken.balanceOf(beneficiary.address)).to.be.equal(estimatedFinalAmount);
            expect(await HamachiToken.balanceOf(VestingVault.address)).to.be.equal(0);
        })

    })
})