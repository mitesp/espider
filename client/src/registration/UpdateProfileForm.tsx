import { navigate } from "@reach/router";
import React, { useEffect, useState } from "react";

import { dashboardURL } from "./urls";

import { studentProfileEndpoint } from "../apiEndpoints";
import axiosInstance from "../axiosAPI";
import {
  renderFirstLastName,
  renderStandardFormField,
  renderStandardFormSelect,
} from "../forms/helpers";

type Props = {
  edition: string;
  program: string;
};

/**************************************************************************
 * TODO: This is student specific, but that's not built into this component
 *************************************************************************/

function UpdateProfileForm(props: Props) {
  const [fields, setFields] = useState({
    affiliation: "",
    city: "",
    country: "",
    dateOfBirth: "",
    email: "",
    firstName: "",
    gradYear: "",
    lastName: "",
    phoneNumber: "",
    pronouns: "",
    school: "",
    state: "",
  });

  useEffect(() => {
    setupProfileInfo();
  }, []);

  function setupProfileInfo() {
    axiosInstance.get(studentProfileEndpoint).then(res => {
      setFields({
        affiliation: res.data.affiliation,
        city: res.data.city,
        country: res.data.country,
        dateOfBirth: res.data.date_of_birth,
        email: res.data.email,
        firstName: res.data.first_name,
        gradYear: res.data.grad_year,
        lastName: res.data.last_name,
        phoneNumber: res.data.phone_number,
        pronouns: res.data.pronouns,
        school: res.data.school,
        state: res.data.state,
      });
    });
  }

  function handleChange(e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement>) {
    const { name, value } = e.currentTarget;
    const newFields = { ...fields };
    // @ts-ignore TODO: figure out better way to do this. There's a better way
    // to create this dependency between the variable name and the string name
    // used for form field attributes
    newFields[name] = value;
    setFields(newFields);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    axiosInstance
      .post(studentProfileEndpoint, {
        affiliation: fields.affiliation,
        city: fields.city,
        country: fields.country,
        edition: props.edition,
        first_name: fields.firstName,
        last_name: fields.lastName,
        email: fields.email,
        phone_number: fields.phoneNumber,
        program: props.program,
        pronouns: fields.pronouns,
        state: fields.state,
        school: fields.school,
        update_profile: true,
      })
      .then(result => {
        /*TODO check validity of submitted data*/
        navigate(dashboardURL);
      });
  }

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-6 is-offset-3">
          <h1 className="has-text-centered is-size-3">Update Profile</h1>
          <form onSubmit={handleSubmit}>
            {renderFirstLastName(handleChange, fields.firstName, fields.lastName)}
            {renderStandardFormSelect("pronouns", handleChange, fields.pronouns)}
            {renderStandardFormField("email", handleChange, fields.email)}
            {renderStandardFormField("phone", handleChange, fields.phoneNumber)}
            {renderStandardFormField("city", handleChange, fields.city)}
            {renderStandardFormField("state", handleChange, fields.state)}
            {renderStandardFormField("country", handleChange, fields.country)}
            {renderStandardFormField("dob", handleChange, fields.dateOfBirth)}
            {renderStandardFormField("gradyear", handleChange, fields.gradYear)}
            {renderStandardFormField("school", handleChange, fields.school)}
            <div className="field">
              <div className="control">
                <button className="button is-link" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfileForm;
