import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { navigate } from "@reach/router";

type Props = {
  edition: string;
  formName: string;
  isStudent: boolean;
  program: string;
  url: string;
};

type State = {};

// This is a placeholder for forms that haven't been implemented yet
// All they do is mark the form as completed in the backend on submit

class DummyForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosInstance
      .post(this.props.url, {
        program: this.props.program,
        edition: this.props.edition,
      })
      .then(result => {
        navigate("dashboard");
      });
  };

  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <h1 className="has-text-centered is-size-3">{this.props.formName}</h1>
            <form onSubmit={this.handleSubmit}>
              <label className="label" htmlFor="name">
                This is a dummy form
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

export default DummyForm;
