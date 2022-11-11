// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./ITaxableCoin.sol";
import "./IVestingContract.sol";
import "./VestingContract.sol";

// We define a contract which allows us to redeem an TaxableCoin with support for cliff vesting
contract TokenSeller is Ownable {
    ///////////////////////////////
    // Storage Variables         //
    ///////////////////////////////
    uint256 public lockupDuration;
    uint256 public basePrice;
    uint256 public totalStaked;
    uint256 public stakingVaultID;
    ITaxableCoin public rewardCoin;
    mapping(address => IVestingContract[]) private userStakingContracts;
    mapping(address => bool) private blacklistedUsers;
    mapping(address => bool) interactedUsers;
    mapping(address => uint256) stakingVaultToId;
    address[] users;

    // Base Price is provided for each individual unit of the coin
    constructor(
        ITaxableCoin _rewardCoin,
        uint256 _lockupDuration,
        uint8 _basePrice
    ) {
        rewardCoin = _rewardCoin;
        lockupDuration = _lockupDuration;
        basePrice = _basePrice;
        stakingVaultID = 1;
    }

    ///////////////////////////////
    // Contract Events           //
    ///////////////////////////////

    event UserBlacklisted(address user, uint256 timestamp);
    event CoinStaked(
        uint256 id,
        address stakingVault,
        address user,
        uint256 unlockTime,
        uint256 value
    );
    event CoinRedeemed(
        uint256 id,
        address stakingVault,
        address user,
        uint256 redemptionTimestamp,
        uint256 value
    );
    event UserRemovedFromBlacklist(address user, uint256 timestamp);

    ///////////////////////////////
    // External Functions        //
    ///////////////////////////////

    function isBlacklisted(address _address) public view returns (bool) {
        return blacklistedUsers[_address];
    }

    // Note that this is expressed in terms of seconds
    function updateLockupDuration(uint256 _lockupDuration) public onlyOwner {
        lockupDuration = _lockupDuration;
    }

    // Note that this is expressed in terms of seconds
    function updateBasePrice(uint256 _basePrice) public onlyOwner {
        basePrice = _basePrice;
    }

    function updateERC20Token(address _erc20Address) public onlyOwner {
        rewardCoin = ITaxableCoin(_erc20Address);
    }

    function removeUserFromBlacklist(address _blacklistedAddress)
        public
        onlyOwner
    {
        require(
            blacklistedUsers[_blacklistedAddress],
            "User is not currently blacklisted"
        );
        emit UserRemovedFromBlacklist(_blacklistedAddress, block.timestamp);
        blacklistedUsers[_blacklistedAddress] = false;
    }

    function blacklistUser(address _blacklistedAddress) public onlyOwner {
        require(
            !(blacklistedUsers[_blacklistedAddress]),
            "User has already been blacklisted"
        );

        for (
            uint256 i = 0;
            i < userStakingContracts[_blacklistedAddress].length;
            i++
        ) {
            IVestingContract userStakingContract = userStakingContracts[
                _blacklistedAddress
            ][i];

            // This returns the tokens to the contract itself for use
            userStakingContract.blacklistBeneficiary();
        }

        emit UserBlacklisted(_blacklistedAddress, block.timestamp);

        // Implementing a primitive set
        blacklistedUsers[_blacklistedAddress] = true;
    }

    // We try to allocate as much coins as possible
    function purchaseCoin(uint256 amount)
        public
        payable
        notBlacklisted
        returns (bool)
    {
        uint256 price = basePrice * amount;
        require(
            price <= msg.value,
            "Insufficient eth provided to purchase token"
        );
        _allocateTokens(amount);
        if (!(interactedUsers[msg.sender])) {
            users.push(msg.sender);
        }
        interactedUsers[msg.sender] = true;

        return true;
    }

    function getRedeemableAmount()
        public
        view
        notBlacklisted
        returns (uint256)
    {
        uint256 totalRedeemable = 0;
        for (uint256 i = 0; i < userStakingContracts[msg.sender].length; i++) {
            IVestingContract stakingContract = userStakingContracts[msg.sender][
                i
            ];
            if (stakingContract.readyForRedemption()) {
                totalRedeemable += rewardCoin.estimateFinalTransfer(
                    stakingContract.vestingVaultValue()
                );
            }
        }
        return totalRedeemable;
    }

    function getStakedAmount() public view notBlacklisted returns (uint256) {
        uint256 userStakedAmount = 0;
        for (uint256 i = 0; i < userStakingContracts[msg.sender].length; i++) {
            IVestingContract stakingContract = userStakingContracts[msg.sender][
                i
            ];
            if (!stakingContract.vaultRedeemed()) {
                userStakedAmount += rewardCoin.estimateFinalTransfer(
                    stakingContract.vestingVaultValue()
                );
            }
        }
        return userStakedAmount;
    }

    function redeemAllStakes() public notBlacklisted returns (bool) {
        for (uint256 i = 0; i < userStakingContracts[msg.sender].length; i++) {
            IVestingContract stakingContract = userStakingContracts[msg.sender][
                i
            ];
            if (stakingContract.readyForRedemption()) {
                uint256 estimatedValue = rewardCoin.estimateFinalTransfer(
                    stakingContract.vestingVaultValue()
                );
                bool result = stakingContract.withdraw();

                // We emit a succesful event to notify individuals that our redemption is succesful
                if (result) {
                    emit CoinRedeemed(
                        stakingVaultToId[address(stakingContract)],
                        address(stakingContract),
                        msg.sender,
                        block.timestamp,
                        estimatedValue
                    );
                    totalStaked -= stakingContract.vestingVaultValue();
                }
            }
        }
        return true;
    }

    // This only returns to the owner the existing reward tokens that have not been utilised
    function withdrawUnusedRewardToken() public onlyOwner returns (bool) {
        rewardCoin.transfer(owner(), rewardCoin.balanceOf(address(this)));
        return true;
    }

    // This blacklists every single user that has existing stakes and returns all the reward token to the owner
    function withdrawAllRewardToken() public onlyOwner returns (bool) {
        for (uint256 i = 0; i < users.length; i++) {
            blacklistUser(users[i]);
        }
        rewardCoin.transfer(owner(), rewardCoin.balanceOf(address(this)));
        totalStaked = 0;
        return true;
    }

    function withdrawAllEth() public onlyOwner returns (bool) {
        (bool sent, bytes memory data) = owner().call{
            value: address(this).balance
        }("");
        require(sent, "Failed to send Ether");
        return true;
    }

    ///////////////////////////////
    // Internal Functions        //
    ///////////////////////////////

    function _allocateTokens(uint256 _amount) internal {
        uint256 userAllocation = _getValidAllocation(_amount);
        require(userAllocation > 0, "Token Seller has no more tokens to sell");
        VestingVault newVestingVault = new VestingVault(msg.sender);
        rewardCoin.approve(address(newVestingVault), userAllocation);

        uint256 postTaxFunding = rewardCoin.estimateFinalTransfer(
            userAllocation
        );
        uint256 userWithdrawlValue = rewardCoin.estimateFinalTransfer(
            postTaxFunding
        );

        bool fundingResult = newVestingVault.fund(
            lockupDuration,
            address(rewardCoin),
            userAllocation
        );
        if (!fundingResult) {
            rewardCoin.approve(address(newVestingVault), 0);
        }
        require(fundingResult, "Vesting Vault was not succesfully funded");
        emit CoinStaked(
            stakingVaultID,
            address(newVestingVault),
            msg.sender,
            newVestingVault.unlockTime(),
            postTaxFunding
        );
        stakingVaultToId[address(newVestingVault)] = stakingVaultID;
        stakingVaultID += 1;
        totalStaked += userWithdrawlValue;
        userStakingContracts[msg.sender].push(
            IVestingContract(address(newVestingVault))
        );
    }

    function _getValidAllocation(uint256 amount)
        internal
        view
        returns (uint256)
    {
        uint256 remainingBalance = rewardCoin.balanceOf(address(this));
        if (amount > remainingBalance) {
            return remainingBalance;
        }
        return amount;
    }

    ///////////////
    // Modifiers //
    ///////////////
    modifier notBlacklisted() {
        require(
            !(blacklistedUsers[msg.sender]),
            "User is blacklisted from contract"
        );
        _;
    }
}
