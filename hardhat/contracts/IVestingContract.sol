// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IVestingContract {
    event Funded(
        uint256 vestingDuration,
        address ERC20Token,
        uint256 fundingAmount
    );
    event Blacklisted(uint256 timestamp);

    function fund(
        uint256 _vestingDuration,
        address ERC20Token,
        uint256 _tokenFunding
    ) external payable returns (bool);

    function blacklistBeneficiary() external;

    function withdraw() external returns (bool);

    function readyForRedemption() external view returns (bool);

    function vestingVaultValue() external view returns (uint256);

    function vaultRedeemed() external view returns (bool);
}
