//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./IVestingContract.sol";

contract VestingVault is Ownable, IVestingContract {
    address payable public beneficiary;
    uint256 public unlockTime;
    uint256 public vestingVaultValue;
    bool public funded;
    bool public vaultRedeemed;
    IERC20 token;
    bool vestingCancelled;

    /////////////////
    // Constructor //
    /////////////////
    constructor(address _beneficiary) {
        beneficiary = payable(_beneficiary);
    }

    ///////////////////////////////
    // External Functions        //
    ///////////////////////////////

    function readyForRedemption() public view returns (bool) {
        return block.timestamp >= unlockTime && !vaultRedeemed;
    }

    function fund(
        uint256 _vestingDuration,
        address ERC20Token,
        uint256 _tokenFunding
    ) public payable onlyOwner returns (bool) {
        _fund(_vestingDuration, ERC20Token, _tokenFunding);
        emit Funded(_vestingDuration, ERC20Token, _tokenFunding);
        return true;
    }

    // Tokens are immediately returned to the owner
    function blacklistBeneficiary() public vaultFunded onlyOwner {
        vestingCancelled = true;
        vaultRedeemed = true;
        emit Blacklisted(block.timestamp);
        _withdrawERC20(owner());
    }

    function withdraw() public returns (bool) {
        _withdraw(beneficiary);
        return true;
    }

    ///////////////////////////////
    // Internal Helper Functions //
    ///////////////////////////////

    function _fund(
        uint256 _vestingDuration,
        address ERC20Token,
        uint256 _tokenFunding
    ) internal onlyOwner {
        require(_vestingDuration > 0, "Vesting Duration needs to be non-zero!");
        token = IERC20(ERC20Token);
        unlockTime = block.timestamp + _vestingDuration;

        //Check to make sure wallet can fund vault
        uint256 walletBalance = token.balanceOf(msg.sender);
        require(
            walletBalance >= _tokenFunding,
            "Owner has insufficient amount to fund this Vault"
        );

        //Transfer funded amount to contract;

        bool fundingSuccess = token.transferFrom(
            msg.sender,
            address(this),
            _tokenFunding
        );
        require(
            fundingSuccess,
            "Transfer from ERC20 Contract Failed. Please check your balance"
        );

        funded = true;
        vestingVaultValue = token.balanceOf(address(this));
    }

    function _withdrawERC20(address _address) internal returns (bool) {
        if (token.balanceOf(address(this)) == 0) {
            return true;
        }
        bool succesfulTokenTransfer = token.transfer(
            _address,
            vestingVaultValue
        );
        return succesfulTokenTransfer;
    }

    function _withdraw(address _address) internal vaultFunded {
        require(
            msg.sender == beneficiary || msg.sender == owner(),
            "Only beneficiary can withdraw money from this contract"
        );

        require(
            !vestingCancelled,
            "Owner has prematurely cancelled vesting and prohibited beneficiary from recieving funds"
        );
        require(
            !vaultRedeemed,
            "Vault's vested tokens have already been redeemed"
        );
        require(
            block.timestamp >= unlockTime,
            "Vesting duration has not been completed, please try again later"
        );
        require(!vaultRedeemed, "Vault has already been redeemed");

        _withdrawERC20(_address);
        vaultRedeemed = true;
    }

    ///////////////
    // Modifiers //
    ///////////////

    modifier vaultFunded() {
        require(
            funded,
            "Vesting Vault has not been funded, please try again later"
        );
        _;
    }
}
