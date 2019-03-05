import ethers, {utils, Interface, Wallet} from 'ethers';
import Identity from 'universal-login-contracts/build/Identity';
import {OPERATION_CALL,MANAGEMENT_KEY, ECDSA_TYPE, ACTION_KEY} from 'universal-login-contracts';
import {addressToBytes32, waitForContractDeploy, waitForTransactionReceipt} from './utils/utils';
import calculateMessageSignature from 'universal-login-contracts/lib/calculateMessageSignature';
import {resolveName, codeEqual} from './utils/ethereum';
import RelayerObserver from './observers/RelayerObserver';
import BlockchainObserver from './observers/BlockchainObserver';
import {headers, fetch} from './utils/http';
import {MESSAGE_DEFAULTS} from './config';


class EthereumIdentitySDK {
  constructor(relayerUrl, providerOrUrl, paymentOptions) {
    this.provider = typeof(providerOrUrl) === 'string' ? new ethers.JsonRpcProvider(providerOrUrl) : providerOrUrl;
    this.relayerUrl = relayerUrl;
    this.relayerObserver = new RelayerObserver(relayerUrl);
    this.blockchainObserver = new BlockchainObserver(this.provider);
    this.defaultPaymentOptions = {...MESSAGE_DEFAULTS, ...paymentOptions};
  }

  async create() {
    const privateKey = this.generatePrivateKey();
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const managementKey = wallet.address;
    const url = `${this.relayerUrl}/identity`;
    const method = 'POST';
    const body = JSON.stringify({managementKey});
    const response = await fetch(url, {headers, method, body});
    const responseJson = await response.json();
    if (response.status === 201) {
      const contract = await waitForContractDeploy(this.provider, Identity, responseJson.transaction.hash);
      return [privateKey, contract.address];
    }
    throw new Error(`${responseJson.error}`);
  }


    async transferByLink({ token, amount, sender, sigSender, transitPK, receiverPubKey }) {
	const transitWallet = new ethers.Wallet(transitPK, this.provider);
	const transitPubKey = transitWallet.address;
	const url = `${this.relayerUrl}/identity/transfer-by-link`;
	const method = 'POST';

	const messageHash = utils.solidityKeccak256(
	    ['address', 'address'],
	    [ receiverPubKey, transitPubKey]
	);
	
	const sigReceiver = transitWallet.signMessage(utils.arrayify(messageHash));

	// check that link is valid
	const contract = new ethers.Contract(sender, Identity.interface, this.provider);
	const isLinkValid =  await contract.isLinkValid(
	    token,
	    amount,  
	    receiverPubKey,
	    transitPubKey,
	    sigSender,
	    sigReceiver	    
	);
	console.log({isLinkValid, receiverPubKey});
	if (!isLinkValid) {
	    throw new Error("Invalid link!");
	}
	
	const body = JSON.stringify({
	    identityPubKey: receiverPubKey,
	    sigSender,
	    sigReceiver,
	    token,
	    amount,
	    transitPubKey,
	    sender
	});
	
	const response = await fetch(url, {headers, method, body});
	const responseJson = await response.json();
	console.log({response, responseJson});
	if (response.status === 201) {
	    return { response, txHash: responseJson.transaction.hash };
	}
	throw new Error(`${responseJson.error}`);	
    }

    async hasLinkBeenUsed({transitPK, sender}) {
	const transitWallet = new ethers.Wallet(transitPK, this.provider);
	const contract = new ethers.Contract(sender, Identity.interface, this.provider);
	return await contract.hasBeenUsed(transitWallet.address);
    }

    
    
    waitForTxReceipt(txHash) {
	return waitForTransactionReceipt(this.provider, txHash);	
    }
    
    generateLink({ privateKey, token, amount, transitPrivKey=null }) {
	// generate transit private key
	const transitPK = transitPrivKey || this.generatePrivateKey();
	const wallet = new ethers.Wallet(privateKey, this.provider);
	const transitPubKey = new ethers.Wallet(transitPK, this.provider).address;
	// sign transit private key	
	const messageHash = utils.solidityKeccak256(
	    ['address', 'uint', 'address'],
	    [ token, amount, transitPubKey]
	);
	const sigSender = wallet.signMessage(utils.arrayify(messageHash));
	return { sigSender, transitPK };
    }
    
  async addKey(to, publicKey, privateKey, transactionDetails) {
    const key = addressToBytes32(publicKey);
    const {data} = new Interface(Identity.interface).functions.addKey(key, MANAGEMENT_KEY, ECDSA_TYPE);
    const message = {
      ...transactionDetails,
      to,
      from: to,
      data
    };
    return await this.execute(message, privateKey);
  }

  async addKeys(to, publicKeys, privateKey, transactionDetails) {
    const keys = publicKeys.map((publicKey) => addressToBytes32(publicKey));
    const keyRoles = new Array(publicKeys.length).fill(MANAGEMENT_KEY);
    const keyTypes = new Array(publicKeys.length).fill(ECDSA_TYPE);
    const {data} = new Interface(Identity.interface).functions.addKeys(keys, keyRoles, keyTypes);
    const message = {
      ...transactionDetails,
      to,
      from: to,
      data
    };
    return await this.execute(message, privateKey);
  }

  async removeKey(to, address, privateKey, transactionDetails) {
    const key = addressToBytes32(address);
    const {data} = new Interface(Identity.interface).functions.removeKey(key, MANAGEMENT_KEY);
    const message = {
      ...transactionDetails,
      to,
      from: to,
      value: 0,
      data,
      operationType: OPERATION_CALL
    };
    return await this.execute(message, privateKey);
  }

  generatePrivateKey() {
    return ethers.Wallet.createRandom().privateKey;
  }

  async getRelayerConfig() {
    const url = `${this.relayerUrl}/config`;
    const method = 'GET';
    const response = await fetch(url, {headers, method});
    const responseJson = await response.json();
    if (response.status === 200) {
      return responseJson;
    }
    throw new Error(`${response.status}`);
  }

  async execute(message, privateKey) {
      const url = `${this.relayerUrl}/identity/execution`;
      const method = 'POST';
      const finalMessage = {
	  ...this.defaultPaymentOptions, 
	  ...message, 
	  nonce: message.nonce || parseInt(await this.getNonce(message.from, privateKey), 10)
      };
      const signature = await calculateMessageSignature(privateKey, finalMessage);
      const body = JSON.stringify({...finalMessage, signature});
      
      const response = await fetch(url, {headers, method, body});
      const responseJson = await response.json();
      console.log({response, responseJson});
      if (response.status === 201) {
	  return { response, txHash: responseJson.transaction.hash };
      }
      throw new Error(`${responseJson.error}`);
  }

  async getNonce(identityAddress, privateKey) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contract = new ethers.Contract(identityAddress, Identity.interface, wallet);
    return await contract.lastNonce();
  }

  getExecutionNonce(emittedEvents) {
    const [eventTopic] = new Interface(Identity.interface).events.ExecutedSigned.topics;
    for (const event of emittedEvents) {
      if (event.topics[0] === eventTopic) {
        return utils.bigNumberify(event.topics[2]);
      }
    }
    throw 'Event ExecutionRequested not emitted';
  }

  async identityExist(identity) {
    const identityAddress = await this.resolveName(identity);
    if (identityAddress && codeEqual(Identity.runtimeBytecode, await this.provider.getCode(identityAddress))) {
      return identityAddress;
    }
    return false;
  }

  async resolveName(identity) {
    this.config = this.config || (await this.getRelayerConfig()).config;
    const {ensAddress} = this.config;
    return resolveName(this.provider, ensAddress, identity);
  }

  async connect(identityAddress) {
    const privateKey = this.generatePrivateKey();
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const key = wallet.address;
    const url = `${this.relayerUrl}/authorisation`;
    const method = 'POST';
    const body = JSON.stringify({identityAddress, key});
    const response = await fetch(url, {headers, method, body});
    if (response.status === 201) {
      return privateKey;
    }
    throw new Error(`${response.status}`);
  }

  async denyRequest(identityAddress, publicKey) {
    const url = `${this.relayerUrl}/authorisation/${identityAddress}`;
    const method = 'POST';
    const body = JSON.stringify({identityAddress, key: publicKey});
    const response = await fetch(url, {headers, method, body});
    if (response.status === 201) {
      return publicKey;
    }
    throw new Error(`${response.status}`);
  }

  async fetchPendingAuthorisations(identityAddress) {
    return this.relayerObserver.fetchPendingAuthorisations(identityAddress);
  }

  subscribe(eventType, identityAddress, callback) {
    if (['AuthorisationsChanged'].includes(eventType)) {
      return this.relayerObserver.subscribe(eventType, identityAddress, callback);
    } else if (['KeyAdded', 'KeyRemoved'].includes(eventType)) {
      return this.blockchainObserver.subscribe(eventType, identityAddress, callback);
    }
    throw `Unknown event type: ${eventType}`;
  }

  async start() {
    await this.relayerObserver.start();
    await this.blockchainObserver.start();
  }

  stop() {
    this.relayerObserver.stop();
    this.blockchainObserver.stop();
  }

  async finalizeAndStop() {
    await this.relayerObserver.finalizeAndStop();
    await this.blockchainObserver.finalizeAndStop();
  }
}

export default EthereumIdentitySDK;
export {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE};
