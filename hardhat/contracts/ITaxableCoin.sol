// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ITaxableCoin {
    /////////////
    // Events  //
    /////////////

    event Transfer(address indexed _from, address indexed _to, uint256 _amount);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    ///////////////////////////////
    // External Functions        //
    ///////////////////////////////

    function estimateFinalTransfer(uint256 _amount)
        external
        view
        returns (uint256);

    function modifyTax(uint8 _tax) external;

    function balanceOf(address _owner) external view returns (uint256);

    function transfer(address _to, uint256 _value) external returns (bool);

    function approve(address _spender, uint256 _value)
        external
        returns (bool success);

    function pauseTransfers() external;

    function enableTransfers() external;

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool);

    function burn(uint256 _amount) external returns (bool);

    function transferToOwner() external returns (bool);
}
