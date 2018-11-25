pragma solidity ^0.4.24;

import "./ERC1077.sol";
import './InviteLinkScheme.sol';


contract Identity is ERC1077, InviteLinkScheme {
  constructor(bytes32 _key) payable public  {
    ERC1077.init(_key);
  }

  function init(bytes32 _key) public {
    ERC1077.init(_key);
  }  
}
