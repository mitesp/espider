import React, { Component } from "react";
import LoginForm from "./LoginForm";

class LoginPage extends Component<{}, {}> {
  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="column is-6 is-offset-3">{<LoginForm />}</div>
        </div>
      </div>
      //TODO figure out how to get this to automatically change when logged in
    );
  }
}

export default LoginPage;
