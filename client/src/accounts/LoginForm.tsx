import React, { useState } from "react";
import axiosInstance from "../axiosAPI";
import { renderStandardFormField } from "../forms/helpers";
import { loginEndpoint } from "../apiEndpoints";

import { navigate } from "@reach/router";

import { useAuth } from "../context/auth";

type Props = {
  setToken: (token: string) => void;
  location?: { state: { referer: string } };
};

function LoginForm(props: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const authToken = useAuth();

  // If there was no referer, default to the dashboard.
  const referer = props.location ? props.location.state.referer : "/dashboard";

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    axiosInstance
      .post(loginEndpoint, { username, password })
      .then(result => {
        if (result.status === 200) {
          axiosInstance.defaults.headers["Authorization"] = "JWT " + result.data.access;
          localStorage.setItem("token", result.data.access);
          localStorage.setItem("refresh", result.data.refresh);
          props.setToken(result.data.access);
          // test referrer in the future
          navigate(referer);
        } else {
          console.log(`bad status ${result.status}`);
          // TODO error state
        }
      })
      .catch(e => {
        // TODO error state
        console.log(`login post error ${e}`);
      });
  }

  // TODO: add in this redirect behavior, test with referer later.
  // TODO: maybe move to LoginPage
  if (authToken) {
    navigate(referer);
  }

  return (
    <form onSubmit={handleLogin}>
      <h1 className="has-text-centered is-size-3">Log in</h1>
      {renderStandardFormField("username", handleChange, username)}
      {renderStandardFormField("password", handleChange, password)}
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

export default LoginForm;
