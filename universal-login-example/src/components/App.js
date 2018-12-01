import React, {Component} from 'react';
import EthereumIdentitySDK from 'universal-login-sdk';
import ethers from 'ethers';
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";
import LinkAccount from './LinkAccount';
import ClaimLink from './ClaimLink';

class App extends Component {
    constructor(props) {
	super(props);

	const serverUrl = 'http://localhost:3005';
	this.provider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io');
	
	this.sdk = new EthereumIdentitySDK(
	    serverUrl,
	    this.provider,
	);
    }

    componentDidMount() {
	this.sdk.start()
    }

    componentWillUnmount() {
	this.sdk.stop()	
    }

    render() {

	return (
		<div className="login-view">
		<div className="container">
		<Router>
		<Switch>
		<Route path="/claim" component={(props) => <ClaimLink {...props} sdk={this.sdk} />} />		
		<Route component={(props) => (<LinkAccount {...props} sdk={this.sdk} />)} />
		
		</Switch>
		
		
		</Router>   
		

		</div>
		</div>
		
	);
    }
}

export default App;
