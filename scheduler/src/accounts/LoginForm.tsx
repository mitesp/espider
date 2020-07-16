import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { loginEndpoint } from "../apiEndpoints";
import { navigate } from "@reach/router";

type LoginProps = {
  onLogin: Function;
};

type LoginState = {
  username: string;
  password: string;
};

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
    switch (name) {
      case "username":
        this.setState({ username: value });
        break;
      case "password":
        this.setState({ password: value });
        break;
    }
  };

  handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosInstance
      .post(loginEndpoint, {
        username: this.state.username,
        password: this.state.password,
      })
      .then(result => {
        axiosInstance.defaults.headers["Authorization"] = "JWT " + result.data.access;
        localStorage.setItem("token", result.data.access);
        localStorage.setItem("refresh", result.data.refresh);
        this.props.onLogin({ loggedIn: true });
        navigate("/");
      });
  };

  render() {
    return (
      <form onSubmit={this.handleLogin}>
        <h1 className="has-text-centered is-size-3">Log in</h1>
        <div className="control has-icons-left">
          <input
            className="input"
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleChange}
            onBlur={this.handleChange}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-user"></i>
          </span>
        </div>

        <div className="control has-icons-left">
          <input
            className="input"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
            onBlur={this.handleChange}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-lock"></i>
          </span>
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
