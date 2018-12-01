import React, {Component} from 'react';

export const EtherscanLink = ({txHash}) => {
    const link = `https://ropsten.etherscan.io/tx/${txHash}`;
    return (
	    <a style={{color: '#0099ff', textDecoration: 'underline'}} href={link} target="_blank">{txHash}</a>
    );
}

export const EtherscanAddressLink = ({address}) => {
    const link = `https://ropsten.etherscan.io/address/${address}`;
    return (
	    <a style={{color: '#0099ff', textDecoration: 'underline'}} href={link} target="_blank">{address}</a>
    );
}


