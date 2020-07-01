import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { navigate } from "@reach/router";
import { renderLabeledInput } from "../forms/helpers";
import { studentSignupEndpoint } from "../apiEndpoints";

type Props = {
  onLogin: Function;
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
        localStorage.setItem("token", result.data.tokens.access);
        localStorage.setItem("refresh", result.data.tokens.refresh);
        this.props.onLogin({ loggedIn: true });
        navigate("dashboard");
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSignup}>
        {renderLabeledInput(this.handleChange, "Username", "username", this.state.username, "text")}
        {renderLabeledInput(
          this.handleChange,
          "Password",
          "password",
          this.state.password,
          "password"
        )}
        {renderLabeledInput(
          this.handleChange,
          "Phone Number",
          "phoneNumber",
          this.state.phoneNumber,
          "tel"
        )}
        {renderLabeledInput(this.handleChange, "School", "school", this.state.school, "text")}
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
