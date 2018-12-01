import React, {Component} from 'react';
import EthereumIdentitySDK from 'universal-login-sdk';
import ethers from 'ethers';
//import ContentContainer from './ContentContainer';
//import Services from '../services/Services';
import Modals from './Modals';

class App extends Component {
    constructor(props) {
	super(props);
	//this.services = new Services();

	const serverUrl = 'http://localhost:3005';
	this.provider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io');
	
	this.sdk = new EthereumIdentitySDK(
	    serverUrl,
	    this.provider,
	);

	this.state = {
	    senderIdentity: "0x018b8cc651F603357e61Ee580570F4286239BD25",
	    senderPrivateKey: "0x5b23ecd5ec23f197a1e1bfece28961f1723be79287d86a08ba2eba140ef8b061"
	};
    }

    componentDidMount() {
	//this.services.start();
	this.sdk.start()
    }

    componentWillUnmount() {
	//this.services.stop();
	this.sdk.stop()	
    }

    async createIdentity() {
	try { 
	    console.log("in create") ;
	    const [senderPrivateKey, senderIdentity] = await this.sdk.create();
	    console.log({senderPrivateKey, senderIdentity});
	    this.setState({
		senderPrivateKey, senderIdentity
	    });
	    
	} catch (err) { 
	    console.log("err: ", err);
	}	
    }

    async transfer() {
	try {
	    const { senderPrivateKey, senderIdentity } = this.state;

	    if (!senderIdentity) {
		alert("Deploy sender identity first"); 
	    }
	    
	    const token = '0x0566c17c5e65d760243b9c57717031c708f13d26';
	    const amount = 1000;

	    const { sigSender, transitPK } = this.sdk.generateLink({privateKey: senderPrivateKey, token, amount}); 

	    const identityPK = "0x4400e41d4cdb5841a5311576e9f4371459f17d6c109eb34a9fdfff38126f7baa"; //null;
	    const sender = senderIdentity;
	    const result = await this.sdk.transferByLink({ token, amount, sender, sigSender, transitPK, identityPK });
	    console.log({result});
	    
	} catch (err) { 
	    console.log("err: ", err);
	}	
    }

    
    render() {
	return (
      <div className="login-view">
        <div className="container">

		<div style={{padding: 20}}> Sender Identity: {this.state.senderIdentity} </div>
		<button onClick={this.createIdentity.bind(this)} className="btn fullwidth"> Create New Identity </button>
		<hr/>
		
		<button onClick={this.transfer.bind(this)} className="btn fullwidth"> Transfer 10 DAI </button>
		</div>

		</div>
		
	);
    }
}

export default App;
