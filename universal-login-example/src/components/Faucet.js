import React, {Component} from 'react';
import { TOKEN_ADDRESS } from './constants';


export default class FaucetLink extends Component {
    
    generateFaucetLink() {

	const faucetIdentity = "0x018b8cc651F603357e61Ee580570F4286239BD25";
	const faucetPK = "0x5b23ecd5ec23f197a1e1bfece28961f1723be79287d86a08ba2eba140ef8b061";
	
	const amount = 10000;
	
	const { sigSender, transitPK } = this.props.sdk.generateLink({privateKey: faucetPK, token: TOKEN_ADDRESS, amount}); 

	const faucetLink = `/#/claim?sig=${sigSender}&pk=${transitPK}&a=${amount}&from=${faucetIdentity}`;
	return faucetLink;
    }
    
    
    render() {
	const faucetLink = this.generateFaucetLink();
	return ( 
		<div style={{paddingTop: 20, paddingBottom: 20}}>
		<h3 style={{paddingBottom: 20}}> You have no account yet </h3>
		<div>
		<div> Follow the link below to get some DAI and get new account</div>
		<div style={{marginTop: 10}}>
		<a style={{color: '#0099ff', textDecoration: 'underline'}} href={faucetLink}>Follow this link to get 10 DAIs</a>
		</div>
	    </div>
		</div>
	);
    }    
}
