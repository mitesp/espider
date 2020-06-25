import React from "react";
import axiosInstance from "../axiosAPI";

interface SignupProps {
  setState: Function;
}

interface SignupState {
  username: string;
  password: string;
}

function isValidField(prop: string, obj: SignupState): prop is keyof SignupState {
  return prop in obj;
}

class SignupForm extends React.Component<SignupProps, SignupState> {
  constructor(props: SignupProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    this.setState((prevstate: SignupState) => {
      const newState = { ...prevstate };
      if (isValidField(name, prevstate)) {
        newState[name] = value;
      }
      return newState;
    });
  };

  handleSignup = (e: React.FormEvent<HTMLFormElement>, data: SignupState) => {
    e.preventDefault();
    axiosInstance.post("/users/", JSON.stringify(data)).then(result => {
      axiosInstance.defaults.headers["Authorization"] = "JWT " + result.data.tokens.access;
      localStorage.setItem("token", result.data.tokens.access);
      localStorage.setItem("refresh", result.data.tokens.refresh);
      this.props.setState({ loggedIn: true });
    });
  };

  render() {
    return (
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSignup(e, this.state)}>
        <h1 className="has-text-centered is-size-2"> Sign Up </h1>
        {/* Validation elements are concurrently commented out */}
        <div className="field">
          <label className="label" htmlFor="username">
            Username
          </label>
          <div className="control has-icons-left has-icons-right">
            <input
              // is-success is-danger
              className="input"
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleChange}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-user"></i>
            </span>
            {/* <span className="icon is-small is-right">
              <i className="fas fa-check"></i>
            </span> */}
          </div>
          {/* <p className="help is-success">This username is available</p> */}
        </div>

        <div className="field">
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="control has-icons-left has-icons-right">
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            {/* <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span> */}
            {/* <span className="icon is-small is-right">
              <i className="fas fa-exclamation-triangle"></i>
            </span> */}
          </div>
          {/* <p className="help is-danger">This  is invalid</p> */}
        </div>
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

export default SignupForm;
