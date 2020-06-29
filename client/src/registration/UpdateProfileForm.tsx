import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { navigate } from "@reach/router";
import { PronounOptions } from "../forms/constants";
import { customInput, labeledInput, labeledSelect } from "../forms/helpers";

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
    axiosInstance.get("/profile/").then(res => {
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
      .post("/profile/", {
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
              <label className="label">Name</label>
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <div className="control is-expanded">
                      {customInput(
                        this.handleChange,
                        "First Name",
                        "firstName",
                        this.state.firstName,
                        "text",
                        "user"
                      )}
                    </div>
                  </div>
                  <div className="field">
                    <div className="control is-expanded">
                      {customInput(
                        this.handleChange,
                        "Last Name",
                        "lastName",
                        this.state.lastName,
                        "text",
                        "user"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {labeledSelect(
                this.handleChange,
                "Pronouns",
                "pronouns",
                this.state.pronouns,
                PronounOptions,
                "transgender-alt",
                "We ask for this information for the purposes of helping our staff use the most respectful language when addressing you."
              )}

              {labeledInput(
                this.handleChange,
                "E-mail",
                "email",
                this.state.email,
                "email",
                "envelope"
              )}
              {labeledInput(
                this.handleChange,
                "Phone Number",
                "phoneNumber",
                this.state.phoneNumber,
                "tel",
                "phone"
              )}

              {labeledInput(this.handleChange, "City", "city", this.state.city, "text", "city")}
              {labeledInput(
                this.handleChange,
                "State",
                "state",
                this.state.state,
                "text",
                "compass"
              )}
              {labeledInput(
                this.handleChange,
                "Country",
                "country",
                this.state.country,
                "text",
                "globe"
              )}

              {this.props.isStudent &&
                labeledInput(
                  this.handleChange,
                  "Date of Birth",
                  "dateOfBirth",
                  this.state.dateOfBirth,
                  "date",
                  "birthday-cake",
                  undefined,
                  true
                )}
              {this.props.isStudent &&
                labeledInput(
                  this.handleChange,
                  "High School Graduation Year",
                  "gradYear",
                  this.state.gradYear,
                  "number",
                  "graduation-cap",
                  undefined,
                  true
                )}
              {this.props.isStudent &&
                labeledInput(
                  this.handleChange,
                  "Current School",
                  "school",
                  this.state.school,
                  "text",
                  "chalkboard-teacher"
                )}

              {this.props.isTeacher &&
                labeledInput(
                  this.handleChange,
                  "MIT Affiliation",
                  "affiliation",
                  this.state.affiliation,
                  "text",
                  "university"
                )}

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
