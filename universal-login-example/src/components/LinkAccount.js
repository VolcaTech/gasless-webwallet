import React, {Component} from 'react';
import ethers from 'ethers';
import FaucetLink from './Faucet';
import { EtherscanLink, EtherscanAddressLink } from './common';

class LinkAccount extends Component {
    constructor(props) {
	super(props);

	// get identity address from localstorage
	const identityPK = localStorage.getItem("LINKS_IDENTITY_PK");
	const identity = localStorage.getItem("LINKS_IDENTITY");
	
	this.state = {
	    identity, 
	    identityPK,
	    balance: 0,
	    fetchingBalance: true
	};
    }    

    async componentDidMount() {
	if (!this.state.identity) { return null;}
	
	const balance = await this.props.tokenService.getBalance(this.state.identity);
	console.log({balance});
	this.setState({
	    balance,
	    fetchingBalance: false
	});
    }

    _logout() {
	const result = confirm("Are you sure you want to logout?");
	if (result) {
	    localStorage.clear();
	    window.location.reload();
	}
    }

    _renderSendBtn() {
	return ( <a href="/#/send"> <button style={{ marginTop: 20, width: 100}} className="btn fullwidth">Send $ </button></a>);
    }
    
    _renderLogout() {
	return (
		<div style={{marginTop: 40}}>
		<button style={{color: 'red' }}  onClick={this._logout.bind(this)}> Logout </button>
		</div>
	);
    }
    
    _renderAccount() {
	let balance;
	if (this.state.fetchingBalance) {
	    balance = "...";
	} else {
	    balance = `$${this.state.balance / 100}`;
	}
	
	
	return (
		<div style={{paddingTop: 20, paddingBottom: 20}}>
		<h2> Your account </h2>
		<div style={{paddingTop: 20, paddingBottom: 10}}> Address: <EtherscanAddressLink address={this.state.identity} /> </div>
		<div> Balance: {balance} </div>
		
		<hr/>
		{ this._renderSendBtn() }
		{this._renderLogout() }
		</div>
	);
    }
    
    render() {
	return this.state.identityPK ? this._renderAccount() : (<FaucetLink sdk={this.props.sdk} />);
    }
}

export default LinkAccount;

