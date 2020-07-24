import { Link } from "@reach/router";
import React, { Component } from "react";

import { studentDashboardEndpoint } from "../apiEndpoints";
import axiosInstance from "../axiosAPI";
import { generalPage } from "../layout/Page";

type CurrentProgram = {
  name: string;
  url: string;
  registered: boolean;
};

type PastProgram = {
  name: string;
  url: string;
};

type Props = {
  username: string;
};

type State = {
  programs: CurrentProgram[];
  previousPrograms: PastProgram[];
};

export default class StudentDashboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      programs: [],
      previousPrograms: [],
    };
  }

  componentDidMount() {
    this.setupStudentDashboard();
  }

  setupStudentDashboard() {
    axiosInstance.get(studentDashboardEndpoint).then(res => {
      this.setState({
        programs: res.data.current,
        previousPrograms: res.data.previous,
      });
    });
  }

  render() {
    // TODO add announcements/dates section
    return generalPage(`Dashboard | MIT ESP`)(
      <div className="container">
        <h1 className="has-text-centered is-size-2">Student Dashboard for {this.props.username}</h1>
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <h2 className="has-text-centered is-size-3">Active Programs</h2>
            {this.state.programs.map((program, index) => {
              return (
                <h3 className="is-size-5" key={index}>
                  {program.name}:{" "}
                  <Link to={`/${program.url}/dashboard`}>
                    {program.registered ? "Go to Dashboard" : "Register!!"}
                  </Link>
                </h3>
              );
            })}
            <br />
            <h2 className="has-text-centered is-size-3">Previous Programs</h2>
            {this.state.previousPrograms.map((program, index) => {
              return (
                <h3 className="is-size-5" key={index}>
                  {program.name}: <Link to={`/${program.url}/dashboard`}>View</Link>
                </h3>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
