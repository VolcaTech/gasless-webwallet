import React, {Component} from 'react';
import ethers from 'ethers';
import FaucetLink from './Faucet';

class LinkAccount extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    identity: null, 
	    privateKey: null
	};
    }

    // async createIdentity() {
    // 	try { 
    // 	    console.log("in create") ;
    // 	    const [senderPrivateKey, senderIdentity] = await this.sdk.create();
    // 	    console.log({senderPrivateKey, senderIdentity});
    // 	    this.setState({
    // 		senderPrivateKey, senderIdentity
    // 	    });
	    
    // 	} catch (err) { 
    // 	    console.log("err: ", err);
    // 	}	
    // }
    
    
    _renderAccount() {
	return (
		<div style={{paddingTop: 20, paddingBottom: 20}}>
		<h2> Your account </h2> 
		</div>
	);
    }
    
    render() {
	return this.state.privateKey ? (<this._renderAccount/>) : (<FaucetLink sdk={this.props.sdk} />);
    }
}

export default LinkAccount;

