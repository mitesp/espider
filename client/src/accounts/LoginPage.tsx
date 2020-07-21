import { navigate } from "@reach/router";
import React from "react";

import LoginForm from "./LoginForm";

import { useLoggedIn } from "../context/auth";

type Props = {
  location: { state?: { referer: { pathname: string } } };
  setToken: (token: string) => void;
};

function LoginPage(props: Props) {
  const loggedIn = useLoggedIn();

  // If there was no referer, default to the dashboard.
  const referer = props.location.state?.referer.pathname || "/dashboard";

  if (loggedIn) {
    navigate(referer);
  }

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-6 is-offset-3">
          <LoginForm setToken={props.setToken} referer={referer} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
