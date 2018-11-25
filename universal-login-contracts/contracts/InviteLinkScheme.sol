import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/AddressUtils.sol";


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
      IdentityFactory _identityFactory = IdentityFactory(0xa65442d12940671602344cc843dfc8c77b1dad4e);
      receiverWallet = _identityFactory.createIdentity(receiverPubKey, _hashLabel, _name, _node, ens, registrar, resolver);
    }
    
    /* ERC20 token = ERC20(tokenAddress); */
    /* token.transfer(receiverIdentity, tokenAmount); */
  }

}
