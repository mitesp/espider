import React, { Component } from "react";
import SignupForm from "../components/SignupForm";
import { UserState } from "../App";

type SignupProps = {
  setState: (data: UserState) => void;
  loggedIn: boolean;
  username: string;
};

class SignupPage extends Component<SignupProps, any> {
  setBothStates = (data: UserState) => {
    this.setState(data);
    this.props.setState(data);
  };

  handleSignup = (e: React.FormEvent<HTMLFormElement>, data: UserState) => {
    this.props.setState(data);
  };

  render() {
    return (
      <div>
        {this.props.loggedIn ? (
          <h3> Hi, {this.props.username}! </h3>
        ) : (
          <SignupForm setState={this.handleSignup} />
        )}
      </div>
      //TODO figure out how to get this to automatically change when logged in
    );
  }
}

export default SignupPage;
