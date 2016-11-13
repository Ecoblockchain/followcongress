import {createStore} from 'redux';
import keyMirror from 'keymirror'
import Immutable from 'immutable'
import firebase from "firebase"

const Type = keyMirror({
  AUTHENTICATE:null
});

class Actions {
  constructor(auth, db, images, history, payments) {
    function dispatch(channel, type, data) {
      db.dispatch(channel, {type, data});
    }

    this.auth = {
      promptForLogin: () => {
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('email');
        auth.signInWithPopup(provider).then(() => {
          history.push('/dashboard');
        });
      },
      loginWithEmailAndPassword: (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
      },
      resetPassword: (resetCode, password) => {
        return auth.confirmPasswordReset(code, password);
      },
      registerWithEmailAndPassword: (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
      },
      checkIfEmailExists: (email) => {
        // TODO: I don't like this, we're returning data from an action, breaking the architectural flow
        return auth.fetchProvidersForEmail(email).then( (providers) => {
          return providers.length > 0;
        });
      },
      forgotPassword: (email) => {
        return auth.sendPasswordResetEmail(email);
      },
      logOut: () => {
        auth.signOut();
        history.push('/');
      },
      authenticated: (user) =>
        db.channelExists(user.uid)
          .then((exists) => {
            if(!exists) { return db.createChannel(user.uid, user.uid); }
          })
          .then(() => dispatch('local', Type.AUTHENTICATE, {uid:user.uid}))
    };
  }
}

const INITIAL_STATE = {
  version: 1
};

function actions(state, event) {
  switch (event.type) {
    case Type.CLEAR:
      return state.clear().merge(INITIAL_STATE);
    case Type.AUTHENTICATE:
      if(!state.get('user') || state.get('user').get('uid') != event.data.uid) {
        return state.set('user', Immutable.Map(event.data));
      }
      return state;
  }
  return state
}

function newStore(ref) {
  return createStore(actions, Immutable.fromJS(INITIAL_STATE));
}

export {newStore, Actions}
