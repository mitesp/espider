import React from "react";
import LoginForm from "./LoginForm";
import { useAuth } from "../context/auth";

type Props = {
  username: string;
  setToken: (arg0: string) => void;
};

function LoginPage(props: Props) {
  const authToken = useAuth();

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-6 is-offset-3">
          {authToken ? <h3> Hi, {props.username}! </h3> : <LoginForm setToken={props.setToken} />}
        </div>
      </div>
    </div>
    //TODO figure out how to get this to automatically change when logged in
  );
}

export default LoginPage;
