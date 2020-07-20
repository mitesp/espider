import React, { useState } from "react";
import { renderStandardFormField } from "../forms/helpers";

import { navigate } from "@reach/router";
import React, { useState } from "react";

import { login } from "./manage";
import { useLoggedIn } from "../context/auth";
import { renderStandardFormField } from "../forms/helpers";

type Props = {
  setToken: (token: string) => void;
  location?: { state: { referer: string } };
};

function LoginForm(props: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loggedIn = useLoggedIn();

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
    login(username, password).then(result => {
      if (result.success) {
        props.setToken(result.info);
        // TODO: test referer in the future
        navigate(referer);
      } else {
        // TODO: will need to surface error to user
        console.log("Error with login " + result.info);
      }
    });
  }

  // TODO: add in this redirect behavior, test with referer later.
  // TODO: maybe move to LoginPage
  if (loggedIn) {
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
