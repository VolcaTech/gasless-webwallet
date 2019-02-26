/* eslint-disable import/first, no-undef, no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './components/App';
require('./css/icomoon.css');
require('./css/main.sass');


ReactDOM.render(
    (<BrowserRouter>	
	  <App />
     </BrowserRouter>
    ), document.getElementById('app'));

/* eslint-enable import/first no-undef */
