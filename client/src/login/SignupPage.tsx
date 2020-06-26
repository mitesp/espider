import React, { Component } from "react";
import SignupForm from "./SignupForm";
import { UserState } from "../App";

type SignupProps = {
  setState: (data: UserState) => void;
  loggedIn: boolean;
  username: string;
};

class SignupPage extends Component<SignupProps, any> {
  handleSignup = (e: React.FormEvent<HTMLFormElement>, data: UserState) => {
    this.props.setState(data);
  };

  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="column is-6 is-offset-3">
            {this.props.loggedIn ? (
              <h3> Hi, {this.props.username}! </h3>
            ) : (
              <SignupForm setState={this.handleSignup} />
            )}
          </div>
        </div>
      </div>
      //TODO figure out how to get this to automatically change when logged in
    );
  }
}

export default SignupPage;
