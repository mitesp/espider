import { navigate } from "@reach/router";
import React, { useState } from "react";

import { login } from "./manage";

import { renderStandardFormField } from "../forms/helpers";

type Props = {
  setToken: (token: string) => void;
  refererPath: string;
};

function LoginForm(props: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    // TODO: find better way than to associate field variable name and form
    // string name
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
        navigate(props.refererPath);
      } else {
        // TODO: will need to surface error to user
        console.log("Error with login " + result.info);
      }
    });
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
