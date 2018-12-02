import React, {Component} from 'react';
import { TOKEN_ADDRESS } from './constants';


class SendForm extends Component {    

    constructor(props) {
	super(props);

	// get identity address from localstorage
	const identityPK = localStorage.getItem("LINKS_IDENTITY_PK");
	const identity = localStorage.getItem("LINKS_IDENTITY");	
	this.state = {
	    identity, 
	    identityPK,
	    balance: 0,
	    fetchingBalance: true,
	    amount: 1
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
    
    generateLink() {
	let { identity, identityPK, amount, balance } = this.state;
	amount = amount * 100;
	const bal = (balance);
	if (amount > bal) {
	    return `Max: ${bal/100}. Not enough balance.`;
	}
	if (amount <= 0) {
	    return `You should add amount!`;
	}

	
	
	const { sigSender, transitPK } = this.props.sdk.generateLink({privateKey: identityPK, token: TOKEN_ADDRESS, amount}); 

	const link = 'http://' + window.location.host + `/#/claim?sig=${sigSender}&pk=${transitPK}&a=${amount}&from=${identity}`;
	return link;
    }
    
    
    render() {
	let link;
	try { 
	    link = this.generateLink();
	} catch(err) {
	    console.log(err);
	    link = "Error";
	}
	return ( 
		<div style={{paddingTop: 20, paddingBottom: 20}}>
		<h3 style={{paddingBottom: 20}}> Your balance: ${this.state.balance / 100}</h3>
		<div>
		<input className="input" type="text" value={this.state.amount} onChange={({target}) => this.setState({amount: target.value})} />
		<div style={{marginTop: 20}}>
		
		<h3> Share this link with receiver </h3>
		<div style={{marginTop: 10}}>
		<input className="input" type="text" value={link} />
		</div>
		</div>

	      <div style={{marginTop: 40}}>
	      <a style={{color: '#0099ff', textDecoration: 'underline'}} href="/#/"> Go to Your Account </a>
	      </div>
		
	    </div>
		</div>
	);
    }
}

export default SendForm;
