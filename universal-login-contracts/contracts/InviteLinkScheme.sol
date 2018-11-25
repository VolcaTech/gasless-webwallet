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
    
    address receiverWallet;
    if (address(receiverPubKey).isContract())  {
      receiverWallet = address(receiverPubKey);
    } else {
      // 0x477be1f1b5cd97125789ac0ed05c501b9c325283 - old address
      IdentityFactory _identityFactory = IdentityFactory(0xA65442d12940671602344Cc843dfc8c77b1DAD4E);
      receiverWallet = _identityFactory.createIdentity(receiverPubKey);
    }
    
    /* ERC20 token = ERC20(tokenAddress); */
    /* token.transfer(receiverIdentity, tokenAmount); */
  }

}
