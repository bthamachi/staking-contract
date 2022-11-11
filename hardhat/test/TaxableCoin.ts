import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { TaxableCoin, TaxableCoin__factory } from "../typechain-types";


//Set Constants
const name = "Hamachi Token"
const symbol = "HMC"
const decimals = 18
const decimalBN = BigNumber.from(10).pow(decimals)
const totalSupply = BigNumber.from(10000).mul(decimalBN)

describe("Taxable Token", function () {

    let TaxableCoin: TaxableCoin

    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress
    let addrs: SignerWithAddress[];

    let beneficiary: SignerWithAddress;

    beforeEach(async function () {

        // Provision Addresses first
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Create Contract Interfaces
        const TaxableCoinFactory: TaxableCoin__factory = await ethers.getContractFactory(
            "TaxableCoin", owner
        )

        //Deploy Contracts
        TaxableCoin = await TaxableCoinFactory.deploy(
            name,
            symbol,
            decimals,
            totalSupply,
            10
        )
    });

    describe("Deployment", function () {
        it("should mint the total supply of coins and mint to owner", async function () {
            expect(await TaxableCoin.balanceOf(owner.address)).to.be.equal(totalSupply)
        })

        it("should set the owner of the contract to the owner", async function () {
            expect(await TaxableCoin.owner()).to.be.equal(owner.address)
        })
    })

    describe("Treasury", function () {
        let transferedCoins: ethers.BigNumber;
        let expectedFinalTransfer: ethers.BigNumber;

        beforeEach(async function () {
            transferedCoins = BigNumber.from(100).mul(decimalBN)
            expectedFinalTransfer = await TaxableCoin.estimateFinalTransfer(transferedCoins)

            await TaxableCoin.transfer(addr1.address, transferedCoins)
            await TaxableCoin.transfer(addr2.address, transferedCoins)
        })
        it("should allow the owner to withdraw all the money in the treasury", async function () {
            let originalOwnerBalance = await TaxableCoin.balanceOf(owner.address)
            let originalTreasuryBalance = await TaxableCoin.balanceOf(
                TaxableCoin.address
            )
            await TaxableCoin.transferToOwner()

            originalOwnerBalance = await TaxableCoin.balanceOf(owner.address)
            originalTreasuryBalance = await TaxableCoin.balanceOf(
                TaxableCoin.address
            )

            expect(await TaxableCoin.balanceOf(
                TaxableCoin.address
            )).to.be.equal(0)

            expect(await TaxableCoin.balanceOf(
                owner.address
            )).to.be.equal(originalOwnerBalance.add(originalTreasuryBalance))
        })
        it("should only throw an error if any other user tries to call this contract", async function () {
            await expect(TaxableCoin.connect(addr1).transferToOwner()).to.be.rejectedWith(
                "This function can only be called by the owner"
            )
        })
    })

    describe("Transfer", function () {
        let transferedCoins: ethers.BigNumber;
        let expectedFinalTransfer: ethers.BigNumber;

        beforeEach(async function () {
            transferedCoins = BigNumber.from(100).mul(decimalBN)
            expectedFinalTransfer = await TaxableCoin.estimateFinalTransfer(transferedCoins)

            await TaxableCoin.transfer(addr1.address, transferedCoins)
            await TaxableCoin.transfer(addr2.address, transferedCoins)
        })

        it("should not allow the user to transfer more money than he has in his bank account", async function () {
            await expect(TaxableCoin.connect(addr1).transfer(
                addr2.address, transferedCoins
            )).to.be.rejectedWith("User does not have enough in his account")
        })


        it("should allow users to transfer money to other users and the tax to be sent to the treasury", async function () {


            expect(await TaxableCoin.balanceOf(addr1.address)).to.be.equal(expectedFinalTransfer);
            expect(await TaxableCoin.balanceOf(addr2.address)).to.be.equal(expectedFinalTransfer);
            expect(await TaxableCoin.balanceOf(owner.address)).to.be.equal(
                totalSupply.sub(transferedCoins).sub(transferedCoins)
            )

        })

        it("should send the collected tax to the contract's address", async function () {
            expect(await TaxableCoin.balanceOf(
                TaxableCoin.address
            )).to.be.equal(transferedCoins.sub(expectedFinalTransfer).mul(2))
        })
    })

    describe("Approval Functions", async function () {
        let transferedCoins: ethers.BigNumber;
        let expectedFinalTransfer: ethers.BigNumber;

        beforeEach(async function () {
            transferedCoins = BigNumber.from(100).mul(decimalBN)
            expectedFinalTransfer = await TaxableCoin.estimateFinalTransfer(transferedCoins)

            await TaxableCoin.transfer(addr1.address, transferedCoins)
            await TaxableCoin.transfer(addr2.address, transferedCoins)
        })

        it("should not allow users to approve more than they have in their account", async function () {
            await expect(TaxableCoin.connect(addr1).approve(addr2.address, transferedCoins.add(2))).to.be.rejectedWith("User cannot approve more than his existing balance")
        })

        it("should not allow users to grant approvals for the zero address", async function () {
            await expect(TaxableCoin.connect(addr1).approve(ethers.constants.AddressZero, expectedFinalTransfer)).to.be.rejectedWith("ERC20: Approval to the zero address cannot be granted")
        })

        it("should not allow users to spend an approved amount on the zero address", async function () {
            await TaxableCoin.approve(addr1.address, transferedCoins);
            await expect(TaxableCoin.connect(addr1).transferFrom(owner.address,
                ethers.constants.AddressZero
                , transferedCoins)).to.be.rejectedWith(
                    "ERC20 : Transfer to the zero address"
                )
        })

        it("should not allow users to spend more than they have been approved for", async function () {
            await TaxableCoin.approve(addr1.address, transferedCoins);
            await expect(TaxableCoin.connect(addr1).transferFrom(owner.address, addr2.address, transferedCoins.mul(2))).to.be.rejectedWith(
                "ERC20 : Approval has not been granted for this amount"
            )
        })

        it("should allow for users to approve others to spend their tokens on their behalf", async function () {
            await TaxableCoin.approve(addr1.address, transferedCoins);
            await TaxableCoin.connect(addr1).transferFrom(owner.address, addr2.address, transferedCoins)

            expect(await TaxableCoin.balanceOf(addr2.address)).to.be.equal(expectedFinalTransfer.mul(2))
            expect(await TaxableCoin.balanceOf(addr1.address)).to.be.equal(expectedFinalTransfer)
            expect(await TaxableCoin.balanceOf(owner.address)).to.be.equal(
                totalSupply.sub((transferedCoins.mul(3)))
            )
        })

        it("should update the allowance of a user after tokens have been spent", async function () {
            await TaxableCoin.approve(addr1.address, transferedCoins);
            await TaxableCoin.connect(addr1).transferFrom(owner.address, addr2.address, transferedCoins.div(2))

            expect(await TaxableCoin.allowance(owner.address, addr1.address)).to.be.equal(
                transferedCoins.div(2)
            )
        })


    })

    describe("Tax Modifications", async function () {
        it("should throw an error if the new tax is greater than 100", async function () {
            await expect(TaxableCoin.modifyTax(200)).to.be.rejectedWith(
                "Tax percentage must lie between 0 and 100"
            )
        })

        it("should throw an error if the new tax is less than 0", async function () {
            await expect(TaxableCoin.modifyTax(-20)).to.be.rejectedWith(
                "value out-of-bounds"
            )
        })

        it("should allow tax to be set", async function () {
            await TaxableCoin.modifyTax(30)
            expect(await TaxableCoin.tax()).to.be.equal(30)
        })
    })

    describe("Burn", function () {
        let transferedCoins: ethers.BigNumber;
        let expectedFinalTransfer: ethers.BigNumber;

        beforeEach(async function () {
            transferedCoins = BigNumber.from(100).mul(decimalBN)
            expectedFinalTransfer = await TaxableCoin.estimateFinalTransfer(transferedCoins)

            await TaxableCoin.transfer(addr1.address, transferedCoins)
            await TaxableCoin.transfer(addr2.address, transferedCoins)
        })

        it("should throw an error when users attempt to burn more tokens than they have", async function () {
            await expect(TaxableCoin.connect(addr1).burn(transferedCoins)).to.be.rejectedWith("ERC20 : Attempting to burn an amount greater than user's balance")
        })

        it("should decrement token supply once burn is succesful", async function () {
            await TaxableCoin.connect(addr1).burn(expectedFinalTransfer)
            expect(await TaxableCoin.currentSupply()).to.be.equal(totalSupply.sub(expectedFinalTransfer))
        })

        it("should update user's balance after burning the token", async function () {
            const burningAmount = expectedFinalTransfer.div(2)
            await TaxableCoin.connect(addr1).burn(burningAmount)
            expect(await TaxableCoin.balanceOf(addr1.address)).to.be.equal(burningAmount)
        })
    })
})

