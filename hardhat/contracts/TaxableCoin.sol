// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ITaxableCoin.sol";

contract TaxableCoin is ITaxableCoin {
    // Public Variables
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    //We also implement a token tax to be funnelled into owner's acc to fund project. Taxes are applied on succesful transfers.
    uint8 public tax;
    address public owner;
    uint256 public currentSupply;
    bool paused;

    mapping(address => uint256) private accountBalance;
    mapping(address => mapping(address => uint256)) private spendingApproval;

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply,
        uint8 _tax
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        tax = _tax;
        owner = msg.sender;
        _mint(msg.sender, totalSupply);
        currentSupply = totalSupply;
    }

    /**
     *
     *
     * External Callable Functions
     *
     * These can be called by other contracts or users
     *
     *
     */
    function estimateFinalTransfer(uint256 _amount)
        public
        view
        returns (uint256)
    {
        uint256 taxedAmount = (tax * _amount) / 100;
        return _amount - taxedAmount;
    }

    function modifyTax(uint8 _tax) public onlyOwner {
        require(_tax <= 100, "Tax percentage must lie between 0 and 100");
        tax = _tax;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return accountBalance[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        _approve(_spender, _value);
        return true;
    }

    function pauseTransfers() public onlyOwner {
        paused = true;
    }

    function enableTransfers() public onlyOwner {
        paused = false;
    }

    // Transfer from allows someone to spend your $$s
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool) {
        // We first update the spending amount
        _spendAllowance(_from, msg.sender, _value);

        // We then initiate the transfer
        _transfer(_from, _to, _value);
        return true;
    }

    function burn(uint256 _amount) public returns (bool) {
        _burn(msg.sender, _amount);
        return true;
    }

    function transferToOwner() public onlyOwner returns (bool) {
        accountBalance[address(this)] = 0;
        accountBalance[owner] += balanceOf(address(this));
        return true;
    }

    /**
     *
     *
     * Internal Transfer Functions
     *
     * These are used as helper functions by our contract to get stuff done
     *
     *
     */
    function _mint(address _account, uint256 _amount) internal {
        require(_account != address(0), "ERC20 : Mint to the zero address");
        require(
            currentSupply + _amount <= totalSupply,
            "ERC20 : Mint would result in more coins than fixed supply"
        );
        accountBalance[_account] += _amount;
        currentSupply += _amount;

        emit Transfer(address(this), _account, _amount);
    }

    function _burn(address _account, uint256 _amount) internal {
        require(_account != address(0), "ERC20: Burn zero address balance");
        require(
            accountBalance[_account] >= _amount,
            "ERC20 : Attempting to burn an amount greater than user's balance"
        );

        accountBalance[_account] -= _amount;
        currentSupply -= _amount;

        emit Transfer(_account, address(0), _amount);
    }

    function _approve(address _spender, uint256 _value) internal {
        require(
            accountBalance[msg.sender] >= _value,
            "User cannot approve more than his existing balance"
        );
        require(
            _spender != address(0),
            "ERC20: Approval to the zero address cannot be granted"
        );
        spendingApproval[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
    }

    function _spendAllowance(
        address _from,
        address _spender,
        uint256 _value
    ) internal {
        require(
            address(_from) != address(0),
            "ERC20 : Zero address cannot grant any allowance"
        );
        require(
            address(_spender) != address(0),
            "ERC20 : Zero address cannot spend any pre-approved balance"
        );
        require(
            allowance(_from, msg.sender) >= _value,
            "ERC20 : Approval has not been granted for this amount"
        );
        spendingApproval[_from][_spender] -= _value;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal transferActive {
        require(
            accountBalance[_from] >= _value,
            "User does not have enough in his account"
        );
        require(_from != address(0), "ERC20 : Transfer from the zero address");
        require(_to != address(0), "ERC20 : Transfer to the zero address");

        uint256 taxedAmount = (tax * _value) / 100;
        uint256 transferAmount = _value - taxedAmount;

        accountBalance[_from] -= _value;
        accountBalance[address(this)] += taxedAmount;
        accountBalance[_to] += transferAmount;

        emit Transfer(_from, _to, transferAmount);
    }

    /**
     *
     *
     * View Functions
     *
     * These are view functions provided by our contract
     *
     *
     */

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256)
    {
        return spendingApproval[_owner][_spender];
    }

    function getTreasury() public view returns (uint256) {
        return accountBalance[address(this)];
    }

    /**
     *
     *
     * Modifiers
     *
     * These are modifiers we can use in our contract
     *
     *
     */
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "This function can only be called by the owner"
        );
        _;
    }

    modifier transferActive() {
        require(!paused, "ERC20: Token transfers are currently paused");
        _;
    }
}
