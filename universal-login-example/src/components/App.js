import React, {Component} from 'react';
import EthereumIdentitySDK from 'universal-login-sdk';
import ethers from 'ethers';
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";
import TokenService from '../services/TokenService';
import { TOKEN_ADDRESS } from './constants';
import LinkAccount from './LinkAccount';
import ClaimLink from './ClaimLink';
import SendLink from './Send';

class App extends Component {
    constructor(props) {
	super(props);

	const serverUrl = 'https://gasless-ropsten.eth2phone.com';
	this.provider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io');
	
	this.sdk = new EthereumIdentitySDK(
	    serverUrl,
	    this.provider,
	);

	this.tokenService = new TokenService(TOKEN_ADDRESS, this.provider);
    }

    componentDidMount() {
	this.sdk.start()
    }

    componentWillUnmount() {
	this.sdk.stop()	
    }

        	// 	
    		// <Route path="/send" component={(props) => <SendLink {...props} tokenService={this.tokenService} sdk={this.sdk} />} />				

    		// <Route component={(props) => (<LinkAccount {...props} sdk={this.sdk} tokenService={this.tokenService} />)} />

    
    render() {

	const LinkAccountComponent = (props) => (<LinkAccount {...props} sdk={this.sdk} tokenService={this.tokenService} />);
	
    	return (
    		<div className="login-view">
    		<div className="container">
    		<Router>
    		<Switch>
		<Route path="/send" component={(props) => <SendLink tokenService={this.tokenService} sdk={this.sdk} />} />
		<Route path="/claim" component={(props) => <ClaimLink location={props.location} sdk={this.sdk} />} />
    		<Route component={LinkAccountComponent} />
    		</Switch>
    		</Router>   
    		</div>
    		</div>
		
    	);
    }
}

export default App;
