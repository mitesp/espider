import React, { Component } from "react";
import axiosInstance from "../axiosAPI";

type LoginProps = {
  onLogin: Function;
};

type LoginState = {
  username: string;
  password: string;
};

function isValidField(prop: string, obj: LoginState): prop is keyof LoginState {
  return prop in obj;
}

class LoginForm extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    this.setState((prevstate: LoginState) => {
      const newState = { ...prevstate };
      if (isValidField(name, prevstate)) {
        newState[name] = value;
      }
      return newState;
    });
  };

  handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosInstance
      .post("/token/", {
        username: this.state.username,
        password: this.state.password,
      })
      .then(result => {
        axiosInstance.defaults.headers["Authorization"] = "JWT " + result.data.access;
        localStorage.setItem("token", result.data.access);
        localStorage.setItem("refresh", result.data.refresh);
        this.props.onLogin({ loggedIn: true });
        window.location.reload(false); // refresh page on submit
      });
  };

  render() {
    return (
      <form onSubmit={this.handleLogin}>
        <h1 className="has-text-centered is-size-3">Log in</h1>
        <div className="field">
          <label className="label" htmlFor="username">
            Username
          </label>
          <div className="control">
            <input
              className="input"
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="control">
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
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

export default LoginForm;
