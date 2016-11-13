import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

import firebase from "firebase"

import {newStore, Actions} from './domain'

import {Landing} from './components/Landing.react'
import {EmailLogin} from './components/auth/EmailLogin.react'

import './style/main.scss'

firebase.initializeApp({
  apiKey: "AIzaSyBam31BtES8bhX704E0UHcqWxz-UdaHsTY",
  authDomain: "followcongress.firebaseapp.com",
  databaseURL: "https://followcongress.firebaseio.com",
  storageBucket: "followcongress.appspot.com",
  messagingSenderId: "550768161163"
});

class AppContext {
  constructor(db, actions) {
    this.db = db;
    this.actions = actions;
  }
}

let ref = firebase.database().ref();
let history = browserHistory;
let db = newStore(ref);

let actions = new Actions(firebase.auth(), db, history);
let appCtx = new AppContext(db, actions);

// Needed for onTouchTap, http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render((
        <MuiThemeProvider>
          <div className="container">
            <Router history={history}>
              <Route path="/" component={Landing} context={appCtx}/>
              <Route path="/auth/login" component={EmailLogin} context={appCtx} />
              <Route path="*" component={Landing} context={appCtx} />
            </Router>
            <footer>
              &copy; Black River LLC
              <a href="mailto:support@bettertomato.co">Contact Us</a>
            </footer>
          </div>
        </MuiThemeProvider>),
    document.getElementById("application")
);

firebase.auth().onAuthStateChanged((authData) => {
  if(authData) {
    actions.auth.authenticated(authData);
  } else {
    actions.auth.unauthenticated();
  }
});
