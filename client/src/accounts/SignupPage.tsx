import { Link } from "@reach/router";
import React, { useState } from "react";

import StudentSignupForm from "./StudentSignupForm";
import { SignupType } from "./types";

import { logout } from "../accounts/manage";
import { useAuth, useLoggedIn } from "../context/auth";
import { generalPage } from "../layout/Page";

type Props = {
  setToken: (token: string) => void;
};

function SignupPage(props: Props) {
  const { username } = useAuth();
  const loggedIn = useLoggedIn();

  const [selectedSignupType, setSelectedSignupType] = useState(SignupType.Student);

  function getButtonClass(signupType: SignupType) {
    return `button ${selectedSignupType === signupType ? "is-active" : ""}`;
  }

  function handleClick(signupType: SignupType) {
    if (signupType !== selectedSignupType) {
      setSelectedSignupType(signupType);
    }
  }

  function handleLogout() {
    logout();
    // NOTE: we need to set the token to empty for application context state
    props.setToken("");
  }

  function renderAlreadyLoggedIn() {
    return (
      <p>
        You are currently logged in as {username}. To create a new account, please{" "}
        <Link to="logout" onClick={handleLogout}>
          log out
        </Link>{" "}
        first.
      </p>
    );
  }

  function renderSignupForms() {
    return generalPage("Sign up | MIT ESP")(
      <React.Fragment>
        <h1 className="has-text-centered is-size-3">Sign Up</h1>
        <p>I am a...</p>

        <button
          className={getButtonClass(SignupType.Student)}
          onClick={() => handleClick(SignupType.Student)}
        >
          Student
        </button>
        <button
          className={getButtonClass(SignupType.Teacher)}
          onClick={() => handleClick(SignupType.Teacher)}
        >
          Teacher
        </button>

        {selectedSignupType === SignupType.Student && (
          <StudentSignupForm setToken={props.setToken} />
        )}

        {/*TODO: add teacher form */}
      </React.Fragment>
    );
  }

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-6 is-offset-3">
          {loggedIn ? renderAlreadyLoggedIn() : renderSignupForms()}
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
