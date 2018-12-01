import React, {Component} from 'react';
import ethers from 'ethers';
import FaucetLink from './Faucet';
const qs = require('querystring');
import { TOKEN_ADDRESS } from './constants';


class ClaimLink extends Component {
    constructor(props) {
	super(props);
	console.log({props});
	const queryParams = qs.parse(props.location.search.substring(1));
	const {
	    sig: sigSender,
	    pk: transitPK,
	    a: amount,
	    from: sender
	} = queryParams;

	this.state = {
	    // identity 
	    identity: null, 
	    identityPK: null,

	    // params from url
	    sigSender,
	    transitPK,
	    amount,
	    sender,

	    // claim tx
	    txHash: null,
	    txReceipt: null,
	    disabled: false 
	};
    }
    
    async claimLink() {
	console.log("In a claim link");
	if (this.state.disabled) { return false; }
	const {
	    identity, 
	    identityPK,	    
	    sigSender,
	    transitPK,
	    amount,
	    sender
	} = this.state;
	this.setState({disabled: true});
	// try { 
	//     // send tx
	const { response, txHash, identityPK: newIdentityPK }  = await this.props.sdk.transferByLink({
		token: TOKEN_ADDRESS,
		amount, sender,
		sigSender,
		transitPK, identityPK
	    });
	    console.log({response, txHash})
	    
	    this.setState({
		txHash
	    });
	    
	    // wait for tx to be mined
	    const txReceipt = await this.props.sdk.waitForTxReceipt(txHash);
	    console.log({txReceipt});
	    this.setState({
		txReceipt
	    });

	    // #todo store identity PK in localstorage 
	    
	// } catch (err) {
	//     console.log("Error: ", err);
	//     alert("Error while claiming tx! Details in the console");
	// }
    }

    _renderClaimBtn() {
	// if tx wasn't initiated
	if (!this.state.txHash) {
	    const btnClass = this.state.disabled ? "btn fullwidth disabled" : "btn fullwidth";
	    return ( <button style={{ marginTop: 20, width: 100}} className={btnClass} onClick={this.claimLink.bind(this)}> <div>Claim </div></button>);
	}

	if (!this.state.txReceipt) { 
	    return (
		    <div>
		    Pending Tx... <a style={{color: '#0099ff', textDecoration: 'underline'}} href={`https://ropsten.etherscan.io/tx/${this.state.txHash}`} target="_blank">txHash</a>
		    </div>
	    );
	}

	
	// tx was mined
	return (
		<div>
		<div style={{paddingTop: 20, paddingBottom: 10}}> Mined Tx: <a style={{color: '#0099ff', textDecoration: 'underline'}} href={`https://ropsten.etherscan.io/tx/${this.state.txHash}`} target="_blank">txHash</a>
		</div>
		<div>
		Claimed To: { this.state.identity } 
	    </div>
		
		</div>
	);	
    }

    _renderLinkDetails() {
	return (
		<div>
		<div style={{paddingTop: 10}}> Amount: {this.state.amount / 100} DAI </div>
		<div style={{paddingTop: 10}}> Claim To: {this.state.identity || "New account"} </div>
		</div>
	);
    }
    
    render() {
	return (
		<div>
		<h2> Claim Link </h2>
		{ this._renderLinkDetails() }
	     <hr/>
	    { this._renderClaimBtn() }
		</div>
	);
    }
}

export default ClaimLink;

