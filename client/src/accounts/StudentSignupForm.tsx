import { navigate } from "@reach/router";
import React, { useState } from "react";

import { signupStudent } from "../accounts/manage";
import { renderStandardFormField } from "../forms/helpers";

type Props = {
  setToken: (token: string) => void;
};

// TODO: add validation
function StudentSignupForm(props: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [school, setSchool] = useState("");

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
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "school":
        setSchool(value);
        break;
    }
  }

  function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signupStudent(username, password, phoneNumber, school).then(result => {
      if (result.success) {
        props.setToken(result.info);
        navigate("dashboard"); // TODO maybe make this redirect to profile editing page
      } else {
        // TODO: will need to surface error to user
        console.log("Error with login " + result.info);
      }
    });
  }

  return (
    <form onSubmit={handleSignup}>
      {renderStandardFormField("username", handleChange, username)}
      {renderStandardFormField("password", handleChange, password)}
      {renderStandardFormField("phone", handleChange, phoneNumber)}
      {renderStandardFormField("school", handleChange, school)}

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

export default StudentSignupForm;
