import React, { Component } from "react";
import LoginForm from "./LoginForm";
import { UserState } from "../App";

interface LoginProps {
  setState: (data: UserState) => void;
  loggedIn: boolean;
  username: string;
}

class LoginPage extends Component<LoginProps, any> {
  setBothStates = (data: UserState) => {
    this.setState(data);
    this.props.setState(data);
  };

  handleLogin = (e: React.FormEvent<HTMLFormElement>, data: UserState) => {
    this.props.setState(data);
  };

  render() {
    return (
      <div>
        {this.props.loggedIn ? (
          <h3> Hi, {this.props.username}! </h3>
        ) : (
          <LoginForm setState={this.handleLogin} />
        )}
      </div>
      //TODO figure out how to get this to automatically change when logged in
    );
  }
}

export default LoginPage;
