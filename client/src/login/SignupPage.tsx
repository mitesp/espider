import React, { Component } from "react";
import SignupForm from "./SignupForm";
import { UserState } from "../App";

type SignupProps = {
  onLogin: (data: UserState) => void;
  loggedIn: boolean;
  username: string;
};

class SignupPage extends Component<SignupProps, {}> {
  render() {
    const { onLogin, loggedIn, username } = this.props;

    return (
      <div className="container">
        <div className="columns">
          <div className="column is-6 is-offset-3">
            {loggedIn ? <h3> Hi, {username}! </h3> : <SignupForm onLogin={onLogin} />}
          </div>
        </div>
      </div>

      //TODO figure out how to get this to automatically change when logged in
    );
  }
}

export default SignupPage;
