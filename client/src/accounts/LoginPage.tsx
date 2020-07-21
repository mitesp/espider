import React from "react";

import LoginForm from "./LoginForm";

import { useLoggedIn } from "../context/auth";

type Props = {
  username: string;
  setToken: (token: string) => void;
};

function LoginPage(props: Props) {
  document.title = "Login | MIT ESP";

  const loggedIn = useLoggedIn();

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-6 is-offset-3">
          {loggedIn ? <h3> Hi, {props.username}! </h3> : <LoginForm setToken={props.setToken} />}
        </div>
      </div>
    </div>
    //TODO figure out how to get this to automatically change when logged in
  );
}

export default LoginPage;
