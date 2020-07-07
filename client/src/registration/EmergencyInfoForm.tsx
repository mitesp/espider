import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { navigate } from "@reach/router";
import { emergencyInfoEndpoint } from "../apiEndpoints";

type Props = {
  isStudent: boolean;
  program: string;
  edition: string;
};

type State = {
  endpoint: string;
};

function isValidField(prop: string, obj: State): prop is keyof State {
  return prop in obj;
}

class EmergencyInfoForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      endpoint: `/${this.props.program}/${this.props.edition}/${emergencyInfoEndpoint}`,
    };
  }

  componentDidMount() {
    this.setupEmergencyInfo();
  }

  setupEmergencyInfo() {
    // TODO make this functional
    axiosInstance
      .get(this.state.endpoint, {
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
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    this.setState((prevstate: State) => {
      const newState = { ...prevstate };
      if (isValidField(name, prevstate)) {
        newState[name] = value;
      }
      return newState;
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosInstance
      .post(this.state.endpoint, {
        program: this.props.program,
        edition: this.props.edition,
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
            <h1 className="has-text-centered is-size-3">Emergency Info</h1>
            <form onSubmit={this.handleSubmit}>
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
