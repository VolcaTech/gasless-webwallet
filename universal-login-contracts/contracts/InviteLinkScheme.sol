pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/AddressUtils.sol";
import './IdentityFactory.sol';


contract InviteLinkScheme { 
  using AddressUtils for address;
  
  
  function transferByLink(
			  address tokenAddress,
			  uint256 tokenAmount,
			  bytes32 receiverPubKey, // address of Wallet Contract or receiver's public key if new address			  
			  bytes transitPubKey,			  			  
			  bytes sigSender,
			  bytes sigReceiver
			  ) public {
    
    // TIDO add checks
    // 1. token amount check
    // 2. sender signature
    // 3. receiver signature
    // 4. that key is used only once
    
    // Contract addresses don't have private keys
    require(!address(receiverPubKey).isContract(), "Contract addresses are not allowed");

    // get receiver wallet
    IdentityFactory _identityFactory = IdentityFactory(0x0b90af7936a2e83ec29f1f1c59beeacad5fa0448);    
    address receiverWallet = _identityFactory.getIdentity(receiverPubKey);
    if (receiverWallet == 0x0) {
      receiverWallet = _identityFactory.createIdentity(receiverPubKey);      
    }
       
    // transfer tokens
    ERC20 token = ERC20(tokenAddress);
    token.transfer(receiverWallet, tokenAmount);
  }

}
