import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { navigate } from "@reach/router";
import { renderLabeledInput } from "../forms/helpers";

type Props = {
  onLogin: Function;
};

type Profile = {
  phoneNumber: string;
  school: string;
};

type State = {
  username: string;
  password: string;
  profile: Profile;
  // TODO: the rest of the fields should be added in later
};

function isProfileField(prop: string, profile: Profile): prop is keyof Profile {
  return prop in profile;
}

function isStateField(prop: string, state: State): prop is keyof State {
  return prop in state;
}

// TODO: add validation
class StudentSignupForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      profile: {
        phoneNumber: "",
        school: "",
      },
    };
  }

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    this.setState((prevState: State) => {
      const newState = { ...prevState };
      if (isProfileField(name, prevState.profile)) {
        newState.profile[name] = value;
      } else if (isStateField(name, prevState)) {
        newState[name] = value;
      }
      return newState;
    });
  };

  handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosInstance.post("/add_student/", JSON.stringify(this.state)).then(result => {
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
