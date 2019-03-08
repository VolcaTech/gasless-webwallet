import React, {Component} from 'react';
import { TOKEN_ADDRESS } from './constants';
import copy from 'copy-to-clipboard';

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
	    amount: 1,
	    copyBtnClicked: false,
	    link: null
	};
    }    

    async componentDidMount() {
	if (!this.state.identity) { return null;}
	
	const balance = await this.props.tokenService.getBalance(this.state.identity);
	console.log({balance});
	this.setState({
	    balance,
	    fetchingBalance: false,
	    link: this.generateLink(this.state.amount, balance)
	});
    }


    _renderCopyBtn(link) {

	const label = this.state.copyBtnClicked ? "Copied!" : "Copy the link";
	const className = this.state.copyBtnClicked ? "btn fullwidth disabled" : "btn fullwidth";
	return ( <button
		 style={{ marginTop: 20, width: 250}}
		 className={className} onClick={() =>  {
	    copy(link);
	    this.setState({
		copyBtnClicked: true
	    })
	}}> {label} </button>);
    }

    
    generateLink(value, balance) {
	let { identity, identityPK } = this.state;
	let amount = value;
	amount = (amount * Math.pow(10,18)).toString();
	const bal = (balance);
	if (amount > bal) {
	    return `Max: ${bal/100}. Not enough balance.`;
	}
	if (amount <= 0) {
	    return `You should add amount!`;
	}	
	
	const { sigSender, transitPK } = this.props.sdk.generateLink({privateKey: identityPK, token: TOKEN_ADDRESS, amount}); 
	
	const link = `${window.location.protocol}//${window.location.host}/#/claim?sig=${sigSender}&pk=${transitPK}&a=${amount}&from=${identity}`;
	return link;
    }
    
    
    render() {

	return ( 
		<div style={{paddingTop: 20, paddingBottom: 20}}>
		<h3 style={{paddingBottom: 20}}> Your balance: ${this.state.balance / Math.pow(10,18)}</h3>
		<div>
		<input className="input" type="text" value={this.state.amount} onChange={({target}) => this.setState({
		    amount: target.value,
		    copyBtnClicked: false,
		    link: this.generateLink(target.value, this.state.balance)
		})} />
		<div style={{marginTop: 20}}>
		
		<h3> Share this link with receiver </h3>
		<div style={{marginTop: 10, marginBottom: 10}}>
		<input className="input" type="text" value={this.state.link} />
		</div>
		{ this._renderCopyBtn(this.state.link) }
		
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
