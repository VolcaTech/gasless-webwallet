import React, {Component} from 'react';
import ethers from 'ethers';
import FaucetLink from './Faucet';
const qs = require('querystring');
import { TOKEN_ADDRESS } from './constants';

const EtherscanLink = ({txHash}) => {
    const link = `https://ropsten.etherscan.io/tx/${txHash}`;
    return (
	    <a style={{color: '#0099ff', textDecoration: 'underline'}} href={link} target="_blank">{txHash}</a>
    );
}

const EtherscanAddressLink = ({address}) => {
    const link = `https://ropsten.etherscan.io/address/${address}`;
    return (
	    <a style={{color: '#0099ff', textDecoration: 'underline'}} href={link} target="_blank">{address}</a>
    );
}


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

	// get identity address from localstorage
	const identityPK = localStorage.getItem("LINKS_IDENTITY_PK");
	const identity = localStorage.getItem("LINKS_IDENTITY");	
	
	this.state = {
	    // identity 
	    identity, 
	    identityPK,
	    newIdentity: (identity === null),

	    // params from url
	    sigSender,
	    transitPK,
	    amount,
	    sender,

	    // claim tx
	    checkingLink: true,
	    usedLink: false,
	    txHash: null,
	    txReceipt: null,
	    disabled: false,
	};
    }

    async componentDidMount() {
    	const {transitPK, sender} = this.state;
    	const result = await this.props.sdk.hasLinkBeenUsed({transitPK, sender});
    	console.log({result});
    	this.setState({
    	    checkingLink: false,
    	    usedLink: result
    	})
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
	try { 
	    //     // send tx
	    const { response, txHash, identityPK: newIdentityPK }  = await this.props.sdk.transferByLink({
		token: TOKEN_ADDRESS,
		amount, sender,
		sigSender,
		transitPK, identityPK
	    });
	    console.log({response, txHash, newIdentityPK});
	    
	    this.setState({
		txHash
	    });
	    
	    // wait for tx to be mined
	    const txReceipt = await this.props.sdk.waitForTxReceipt(txHash);
	    console.log({txReceipt});
	    let newIdentity;
	    if (this.state.newIdentity) {
		newIdentity = txReceipt.logs[0] && txReceipt.logs[0].address;

		this._saveToLocalStorage({
		    identityPK: newIdentityPK,
		    identity: newIdentity
		});
	    }	
	    
	    this.setState({
		txReceipt,
		identity: identity || newIdentity
	    });

	    // #todo store identity PK in localstorage 
	    
	} catch (err) {
	    console.log("Error: ", err);
	    alert("Error while claiming tx! Details in the console");
	}
    }

    _saveToLocalStorage({identityPK, identity}) {
	console.log("saving new identity to localstorgae");
	localStorage.setItem("LINKS_IDENTITY_PK", identityPK);
	localStorage.setItem("LINKS_IDENTITY", identity);
	console.log("new identity saved!");
    }
    
    _renderClaimBtn() {
	// if tx wasn't initiated
	if (this.state.checkingLink) {
	    return (<div> Checking link...</div>)
	}

	if (this.state.usedLink) {
	    return (<div style={{fontWeight: 'bold'}}> Link was used</div>)
	}

	
	if (!this.state.txHash) {
	    const btnClass = this.state.disabled ? "btn fullwidth disabled" : "btn fullwidth";
	    return ( <button style={{ marginTop: 20, width: 100}} className={btnClass} onClick={this.claimLink.bind(this)}> <div>Claim </div></button>);
	}

	// tx sent but not mined yet
	if (!this.state.txReceipt) { 
	    return (
		    <div>
		    Pending Tx... <EtherscanLink txHash={this.state.txHash} />
		    </div>
	    );
	}
	
	// tx was mined
	return (
		<div>
		<div style={{paddingTop: 20, paddingBottom: 10}}> Mined Tx: <EtherscanLink txHash={this.state.txHash} />
		</div>
		<div>
		Claimed To: <EtherscanAddressLink address={this.state.identity} /> 
	    </div>
		</div>
	);	
    }

    _renderLinkDetails() {
	const claimTo = this.state.newIdentity ? "New account" : (<EtherscanAddressLink address={this.state.identity} />);
	return (
		<div>
		<div style={{paddingTop: 10}}> Amount: {this.state.amount / 100} DAI </div>
		<div style={{paddingTop: 10}}> Claim To: {claimTo} </div>
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

