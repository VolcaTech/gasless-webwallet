pragma solidity ^0.4.24;

import './Identity.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import './CloneFactory.sol';


contract IdentityFactory is Ownable, CloneFactory {

  address public libraryAddress;

  mapping (bytes32 => address) identitiesDct;
  
  event IdentityCreated(address newIdentityAddr);
  
  function setLibraryAddress(address _libraryAddress) public onlyOwner {
    libraryAddress = _libraryAddress;
  }

  function getIdentity(bytes32 _key) public view returns (address) {
    return identitiesDct[_key];
  }

  function createIdentity(bytes32 _key) public returns(address) {
    
    // only one identity contract per public key
    require(getIdentity(_key) == 0x0);
    
    address newIdentityAddr = createClone(libraryAddress);

    identitiesDct[_key] = newIdentityAddr;
    
    Identity(newIdentityAddr).init(_key);
    
    emit IdentityCreated(newIdentityAddr);
    return newIdentityAddr;
  }
}
