import React, { Component } from "react";
import SignupForm from "./SignupForm";
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
      <section className="pt-5 pb-5">
        <div className="container content">
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
      </section>
      //TODO figure out how to get this to automatically change when logged in
    );
  }
}

export default SignupPage;
