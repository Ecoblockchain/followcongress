import React from 'react'

import {Link} from 'react-router'
import {LiveComponent} from './LiveComponent.react'

class Landing extends LiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn:false
    };
  }

  goToLogin = () => this._actions.auth.promptForLogin();

  render() {
    let button = <div>
      <button onClick={this.goToLogin} className="fb-login">Continue with Facebook</button>
      <br />
      <Link to="/auth/login">Continue with email</Link>
    </div>;
    if(this.state.loggedIn) {
      button = <Link to="/dashboard">Go to Dashboard</Link>
    }

    return (
      <div className="vertical-center">
        <div id="landing-tron">
          <h3 className="logo">FollowCongress</h3>
          <p>Get updates when your congressmen propose new laws</p>
          {button}
        </div>
      </div>);
  }

  query(state) {
    setState({loggedIn:state.has('user')});
  }
}

export {Landing}
