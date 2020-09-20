import * as React from 'react'
import * as ReactDOM from "react-dom"
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)
import App from './App'
import './styles.css'

var mountNode = document.getElementById("app");
ReactDOM.render(<App name={'Strataki'} />, mountNode);
