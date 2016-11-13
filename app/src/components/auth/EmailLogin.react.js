import React from 'react'

import {Link} from 'react-router'
import {LiveComponent} from '../LiveComponent.react'
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardTitle,  CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';


class EmailLogin extends LiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      email:"",
      password: "",
      error:"",
      mode:"SUPERSTATE", // we don't know if this will be a login or a registration form yet..
    };

    this.query = [`{
      user {
        uid
      }
    }`, {}];
  }

  render() {
    let form;
    let emailForm = <form onSubmit={this.emailSubmitted}>
      <TextField
        hintText="me@example.com"
        floatingLabelText="Email"
        value={this.state.email}
        onChange={this.emailChanged}
      />
    </form>;
    let password = <span />;
    let actions = <span />;
    let title, subtitle;

    switch(this.state.mode) {
      case "SUPERSTATE":
        title = "Sign in - or up!";
        subtitle = "Get started by entering your email";
        actions = <FlatButton
          onTouchTap={this.emailSubmitted}
          label="Continue"
        />;
        break;
      case "REGISTER":
        title = "Register new user";
        subtitle = "Looks like you're new, welcome! Choose a good password, and we'll be on our way.";
        password = <form onSubmit={this.register}><TextField
          hintText=""
          floatingLabelText="Choose a password"
          type="password"
          autoFocus
          value={this.state.password}
          onChange={this.passwordChanged}
        /></form>;
        actions = <FlatButton
          onTouchTap={this.register}
          label="Register"
        />;
        break;
      case "LOGIN":
        title = "Log in";
        subtitle = "Welcome back! Remember your password?";
        password = <div>
          <form onSubmit={this.login}><TextField
            hintText=""
            floatingLabelText="Password"
            type="password"
            autoFocus
            value={this.state.password}
            onChange={this.passwordChanged}
          /></form>
          <br />
          <FlatButton
            onTouchTap={this.handleForgotPassword}
            label="Forgot password?"
          />
        </div>;
        actions = <FlatButton
          onTouchTap={this.login}
          label="Log in"
        />;
        break;
      case "PASSWORD_RESET":
        title = "Reset password";
        subtitle = "Nothing to worry about!";
        emailForm = <span />;
        password = <div>
          <p>We have emailed you a link to reset your password, follow the instructions in there. See you soon!</p>
        </div>;
        actions = <span />;
        break;
    }


    if(this.state.user && false) {
      form = <div>
        <p>You are already logged in!</p>
        <Link to="/dashboard">Go to Dashboard</Link>
      </div>
    } else {
      form = <Card>
        <CardTitle
          title={title}
          subtitle={subtitle} />
        <CardText>
          {emailForm}
          <br />
          {password}
          <span className="error">{this.state.error}</span>
        </CardText>
        <CardActions>
          {actions}
        </CardActions>
      </Card>;
    }

    return (
      <div>
        <AppBar
          title="Log in, or sign up"
          iconElementLeft={<IconButton><ArrowBack /></IconButton>}
          onLeftIconButtonTouchTap={this.goToDashboard} />

        {form}
      </div>);

  }
  goToDashboard = () => this.props.history.push("/dashboard");
  emailChanged = (ev) => this.setState({email:ev.target.value});
  passwordChanged = (ev) => this.setState({password: ev.target.value});
  emailSubmitted = (ev) => {
    ev.preventDefault();
    this._actions.auth.checkIfEmailExists(this.state.email).then((exists) => {
      if(exists) {
        this.setState({mode:"LOGIN", error:""});
      } else {
        this.setState({mode:"REGISTER", error:""});
      }
    });
  };
  setError = (err) => this.setState({errorMessage:err});

  login = (ev) => {
    ev.preventDefault();
    this._actions.auth.loginWithEmailAndPassword(this.state.email, this.state.password)
      .then(this.goToDashboard)
      .catch( (err) => {
        // TODO: Handle errors that the user cannot fix (like disabled sign-in provider) differently
        this.setError(err.message);
      });
  };
  register = (ev) => {
    ev.preventDefault();
    this._actions.auth.registerWithEmailAndPassword(this.state.email, this.state.password)
      .then(this.goToDashboard)
      .catch( (err) => {
        this.setError(err.message);
      });
  };
  handleForgotPassword = (ev) => {
    ev.preventDefault();
    this._actions.auth.forgotPassword(this.state.email).then( () => {
      this.setState({mode:"PASSWORD_RESET", error:""});
    })
  };
}

export {EmailLogin}
