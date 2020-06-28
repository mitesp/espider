import React, { Component } from "react";
import SignupForm from "./SignupForm";
import { UserState } from "../App";
import { SignupType } from "./types";

type Props = {
  onLogin: (data: UserState) => void;
  loggedIn: boolean;
  username: string;
};

type State = {
  signupType: SignupType;
};

class SignupPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      signupType: SignupType.Student,
    };
  }

  getButtonClass(signupType: SignupType) {
    return this.state.signupType === signupType ? "button is-active" : "button";
  }

  handleClick(signupType: SignupType) {
    if (signupType !== this.state.signupType) {
      this.setState({ signupType: signupType });
    }
  }

  render() {
    // eslint-disable-next-line
    const { onLogin, loggedIn, username } = this.props;

    return (
      <div className="container">
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <h1 className="has-text-centered is-size-3">Sign Up</h1>
            <p>I am a...</p>

            <button
              className={this.getButtonClass(SignupType.Student)}
              onClick={() => this.handleClick(SignupType.Student)}
            >
              Student
            </button>
            <button
              className={this.getButtonClass(SignupType.Teacher)}
              onClick={() => this.handleClick(SignupType.Teacher)}
            >
              Teacher
            </button>

            <SignupForm onLogin={onLogin} />
            {/* TODO: this should depend on signupType */}
          </div>
        </div>
      </div>
      //TODO: already have an account?
      //TODO figure out how to get this to automatically change when logged in
    );
  }
}

export default SignupPage;
