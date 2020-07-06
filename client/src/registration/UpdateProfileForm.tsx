import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { navigate } from "@reach/router";
import {
  renderFirstLastName,
  renderStandardFormField,
  renderStandardFormSelect,
} from "../forms/helpers";
import { studentProfileEndpoint } from "../apiEndpoints";

type Props = {
  edition: string;
  isStudent: boolean;
  isTeacher: boolean;
  program: string;
};

type State = {
  affiliation: string;
  city: string;
  country: string;
  dateOfBirth: string;
  email: string;
  firstName: string;
  gradYear: string;
  lastName: string;
  phoneNumber: string;
  pronouns: string;
  school: string;
  state: string;
};

function isValidField(prop: string, obj: State): prop is keyof State {
  return prop in obj;
}

class UpdateProfileForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
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
    };
  }

  componentDidMount() {
    this.getProfileInfo();
  }

  getProfileInfo() {
    axiosInstance.get(studentProfileEndpoint).then(res => {
      this.setState({
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

  handleChange = (e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    this.setState(() => {
      const newState = { ...this.state };
      if (isValidField(name, this.state)) {
        newState[name] = value;
      }
      return newState;
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosInstance
      .post(studentProfileEndpoint, {
        affiliation: this.state.affiliation,
        city: this.state.city,
        country: this.state.country,
        edition: this.props.edition,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        phone_number: this.state.phoneNumber,
        program: this.props.program,
        pronouns: this.state.pronouns,
        state: this.state.state,
        school: this.state.school,
        update_profile: true,
      })
      .then(result => {
        /*TODO check validity of submitted data*/
        navigate("dashboard");
      });
  };

  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <h1 className="has-text-centered is-size-3">Update Profile</h1>
            <form onSubmit={this.handleSubmit}>
              {renderFirstLastName(this.handleChange, this.state.firstName, this.state.lastName)}

              {renderStandardFormSelect("pronouns", this.handleChange, this.state.pronouns)}

              {renderStandardFormField("email", this.handleChange, this.state.email)}

              {renderStandardFormField("phone", this.handleChange, this.state.phoneNumber)}

              {renderStandardFormField("city", this.handleChange, this.state.city)}

              {renderStandardFormField("state", this.handleChange, this.state.state)}

              {renderStandardFormField("country", this.handleChange, this.state.country)}

              {renderStandardFormField("dob", this.handleChange, this.state.dateOfBirth)}

              {renderStandardFormField("gradyear", this.handleChange, this.state.gradYear)}

              {renderStandardFormField("school", this.handleChange, this.state.school)}

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
}

export default UpdateProfileForm;
