import React from "react";
import axiosInstance from "../axiosAPI";
import { navigate } from "@reach/router";

type Props = {
  isStudent: boolean;
  isTeacher: boolean;
  program: string;
  edition: string;
};

type State = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  pronouns: string;
  city: string;
  state: string;
  country: string;
  dateOfBirth: string;
  gradYear: string;
  school: string;
  affiliation: string;
};

const PronounOptions: string[] = [
  "He/Him/His",
  "She/Her/Hers",
  "They/Them/Theirs",
  "Other",
  "Prefer Not to Say",
];

function isValidField(prop: string, obj: State): prop is keyof State {
  return prop in obj;
}

class UpdateProfileForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      pronouns: "",
      city: "",
      state: "",
      country: "United States",
      dateOfBirth: "",
      gradYear: "",
      school: "",
      affiliation: "",
    };
  }

  componentDidMount() {
    this.getProfileInfo();
  }

  getProfileInfo() {
    axiosInstance.get("/profile/").then(res => {
      this.setState({
        email: res.data.email,
        firstName: res.data.first_name,
        lastName: res.data.last_name,
        phoneNumber: res.data.phone_number,
        pronouns: res.data.pronouns,
        city: res.data.city,
        state: res.data.state,
        country: res.data.country,
        dateOfBirth: res.data.date_of_birth,
        gradYear: res.data.grad_year,
        school: res.data.school,
        affiliation: res.data.affiliation,
      });
    });
  }

  handleChange = (e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value as string;
    this.setState((prevstate: State) => {
      const newState = { ...prevstate };
      if (isValidField(name, prevstate)) {
        newState[name] = value;
      }
      return newState;
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>, data: State) => {
    e.preventDefault();
    axiosInstance
      .post("/profile/", {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        phone_number: this.state.phoneNumber,
        pronouns: this.state.pronouns,
        city: this.state.city,
        state: this.state.state,
        country: this.state.country,
        date_of_birth: this.state.dateOfBirth,
        grad_year: this.state.gradYear,
        school: this.state.school,
        affiliation: this.state.affiliation,
        update_profile: true,
        program: this.props.program,
        edition: this.props.edition,
      })
      .then(result => {
        /*TODO check validity of submitted data*/
        navigate("dashboard");
      });
  };

  customInput(label: string, name: string, value: string, type: string, icon?: string) {
    let className = "control";
    if (icon) {
      className += " has-icons-left";
    }
    return (
      <div className={className}>
        <input
          className="input"
          id={name}
          name={name}
          type={type}
          placeholder={label}
          value={value}
          onChange={this.handleChange}
        />
        {icon && (
          <span className="icon is-small is-left">
            <i className={"fas fa-" + icon}></i>
          </span>
        )}
      </div>
    );
  }

  labeledInput(label: string, name: string, value: string, type: string, icon?: string) {
    return (
      <div className="field">
        <label className="label" htmlFor={name}>
          {label}
        </label>
        {this.customInput(label, name, value, type, icon)}
      </div>
    );
  }

  labeledSelect(
    label: string,
    name: string,
    value: string,
    options: string[],
    icon?: string,
    help?: string
  ) {
    let className = "control";
    if (icon) {
      className += " has-icons-left";
    }
    return (
      <div className="field">
        <label className="label" htmlFor={name}>
          {label}
        </label>
        <div className={className}>
          <div className="select is-normal is-expanded">
            <select
              id={name}
              name={name}
              value={value}
              placeholder={label}
              onChange={this.handleChange}
            >
              {PronounOptions.map(pronoun => {
                return <option value={pronoun}>{pronoun}</option>;
              })}
            </select>
          </div>
          {icon && (
            <span className="icon is-left">
              <i className={"fas fa-" + icon}></i>
            </span>
          )}
          {help && <p className="help"> {help} </p>}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <h1 className="has-text-centered is-size-3">Update Profile</h1>
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e, this.state)}
            >
              <label className="label" htmlFor="name">
                Name
              </label>
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <div className="control is-expanded">
                      {this.customInput(
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
                      {this.customInput(
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

              {this.labeledSelect(
                "Pronouns",
                "pronouns",
                this.state.pronouns,
                PronounOptions,
                "transgender-alt",
                "We require this information for the purposes of helping our staff use the most respectful language when addressing you."
              )}

              {this.labeledInput("E-mail", "email", this.state.email, "email", "envelope")}
              {this.labeledInput(
                "Phone Number",
                "phoneNumber",
                this.state.phoneNumber,
                "tel",
                "phone"
              )}

              {this.labeledInput("City", "city", this.state.city, "text", "city")}
              {this.labeledInput("State", "state", this.state.state, "text", "compass")}
              {this.labeledInput("Country", "country", this.state.country, "text", "globe")}

              {this.props.isStudent &&
                this.labeledInput(
                  "Date of Birth",
                  "dateOfBirth",
                  this.state.dateOfBirth,
                  "text",
                  "birthday-cake"
                )}
              {this.props.isStudent &&
                this.labeledInput(
                  "High School Graduation Year",
                  "gradYear",
                  this.state.gradYear,
                  "text",
                  "graduation-cap"
                )}
              {this.props.isStudent &&
                this.labeledInput(
                  "Current School",
                  "school",
                  this.state.school,
                  "text",
                  "chalkboard-teacher"
                )}

              {this.props.isTeacher &&
                this.labeledInput(
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
