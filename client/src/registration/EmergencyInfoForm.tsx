import React from "react";
import axiosInstance from "../axiosAPI";
import { navigate } from "@reach/router";

type Props = {
  isStudent: boolean;
  program: string;
  edition: string;
};

type State = {
  something: string;
};

function isValidField(prop: string, obj: State): prop is keyof State {
  return prop in obj;
}

class EmergencyInfoForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      something: "",
    };
  }

  componentDidMount() {
    this.getEmergencyInfo();
  }

  getEmergencyInfo() {
    axiosInstance
      .get("/emergency_info/", {
        params: {
          program: this.props.program,
          edition: this.props.edition,
        },
      })
      .then(res => {
        this.setState({});
      });
  }

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name as string;
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
      .post("/emergency_info/", {
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

  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <h1 className="has-text-centered is-size-3">Emergency Info</h1>
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e, this.state)}
            >
              <label className="label" htmlFor="name">
                I have no clue what fields go here
              </label>

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

export default EmergencyInfoForm;
