import Identity from 'universal-login-contracts/build/Identity';
import IdentityFactory from 'universal-login-contracts/build/IdentityFactory';
import {addressToBytes32, hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall} from '../utils/utils';
import ethers, {utils, Interface} from 'ethers';
import defaultDeployOptions from '../config/defaultDeployOptions';


class IdentityService {
  constructor(wallet, ensService, authorisationService, hooks, provider) {
    this.wallet = wallet;
    this.abi = Identity.interface;
    this.ensService = ensService;
    this.authorisationService = authorisationService;
    this.codec = new utils.AbiCoder();
    this.hooks = hooks;
    this.provider = provider;
  }

    async create(managementKey, ensName, overrideOptions = {}) {
	const key = addressToBytes32(managementKey);
	const bytecode = `0x${Identity.bytecode}`;
	const args = [key];
	const deployTransaction = {
            ...defaultDeployOptions,
            ...overrideOptions,
            ...ethers.Contract.getDeployTransaction(bytecode, this.abi, ...args)
	};
	const transaction = await this.wallet.sendTransaction(deployTransaction);
	this.hooks.emit('created', transaction);
	return transaction;
    }
    
  async executeSigned(message) {
    if (await hasEnoughToken(message.gasToken, message.from, message.gasLimit, this.provider)) {
      const {data} = new Interface(Identity.interface).functions.executeSigned(message.to, message.value, message.data, message.nonce, message.gasPrice, message.gasToken, message.gasLimit, message.operationType, message.signature);
      const transaction = {
        value: 0,
        to: message.from,
        data,
        ...defaultDeployOptions
      };
      const estimateGas = await this.wallet.estimateGas(transaction);
      if (message.gasLimit >= estimateGas) {
        if (message.to === message.from && isAddKeyCall(message.data)) {
          const key = getKeyFromData(message.data);
          await this.authorisationService.removeRequest(message.from, key);
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('added', sentTransaction);
          return sentTransaction;
        } else if (message.to === message.from && isAddKeysCall(message.data)) {
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('keysAdded', sentTransaction);
          return sentTransaction;
        }
        return await this.wallet.sendTransaction(transaction);
      }
    }
    throw new Error('Not enough tokens');
  }


    async createIdentityFactory(overrideOptions = {}) {
	const bytecode = `0x${IdentityFactory.bytecode}`;
	const abi = IdentityFactory.interface;
	const deployTransaction = {
	    value: 0,
	    ...defaultDeployOptions,
	    ...overrideOptions,
	    ...ethers.Contract.getDeployTransaction(bytecode, abi)
	};
	const transaction = await this.wallet.sendTransaction(deployTransaction);

	console.log("creating Identity Factory");
	this.hooks.emit('created', transaction);
	return transaction;
    }

    async transferTokensByLink({
	identityPubKey,
	sigSender,
	sigReceiver,
	token,
	amount,
	transitPubKey,
	sender
    }) {
	const receiverPubKey = addressToBytes32(identityPubKey);
	const bytecode = `0x${Identity.bytecode}`;

	
	const { data } = new Interface(Identity.interface)
		  .functions.transferByLink(
		      token, 
		      amount,
		      receiverPubKey,
		      transitPubKey,
		      sigSender,
		      sigReceiver
		  );
	console.log({data});
	const transaction = {
	    value: 0,
	    to: sender, // sender's identity address
	    data,
	    ...defaultDeployOptions
	};


	this.hooks.emit('created', transaction);
	//return transaction;
	return await this.wallet.sendTransaction(transaction);
    }
    
    
    
}

export default IdentityService;
