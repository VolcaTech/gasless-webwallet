pragma solidity ^0.4.24;

import "./ERC1077.sol";


contract Identity is ERC1077 {
    constructor(
        bytes32 _key) 
        payable public        
        ERC1077(_key) {
    }
}
