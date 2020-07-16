import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { renderStandardFormField } from "../forms/helpers";
import { studentSignupEndpoint } from "../apiEndpoints";

import { navigate } from "@reach/router";

type Props = {
  setToken: (token: string) => void;
};

type State = {
  username: string;
  password: string;
  phoneNumber: string;
  school: string;
  // TODO: the rest of the fields should be added in later
};

// TODO(sophie): look more at this
function isValidField(prop: string, state: State): prop is keyof State {
  return prop in state;
}

// TODO: add validation
class StudentSignupForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      phoneNumber: "",
      school: "",
    };
  }

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    this.setState((prevState: State) => {
      const newState = { ...prevState };
      if (isValidField(name, prevState)) {
        newState[name] = value;
      }
      return newState;
    });
  };

  handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosInstance
      .post(studentSignupEndpoint, {
        username: this.state.username,
        password: this.state.password,
        profile: {
          phone_number: this.state.phoneNumber,
          school: this.state.school,
        },
      })
      .then(result => {
        // TODO: handle failure
        axiosInstance.defaults.headers["Authorization"] = "JWT " + result.data.tokens.access;
        // TODO: add this back, and REFACTOR. This should not have been in two places.
        localStorage.setItem("token", result.data.tokens.access);
        localStorage.setItem("refresh", result.data.tokens.refresh);
        this.props.setToken(result.data.tokens.access);
        navigate("dashboard"); // TODO maybe make this redirect to profile editing page
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSignup}>
        {renderStandardFormField("username", this.handleChange, this.state.username)}
        {renderStandardFormField("password", this.handleChange, this.state.password)}
        {renderStandardFormField("phone", this.handleChange, this.state.phoneNumber)}
        {renderStandardFormField("school", this.handleChange, this.state.school)}

        <div className="field">
          <div className="control">
            <button className="button is-link" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default StudentSignupForm;
