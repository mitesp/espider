import { Link } from "@reach/router";
import React, { Component } from "react";

import { teacherDashboardEndpoint } from "../apiEndpoints";
import axiosInstance from "../axiosAPI";

type JSONProgram = {
  name: string;
  edition: string;
};

type Program = {
  name: string;
  url: string;
};

type Props = {
  username: string;
};

type State = {
  programs: Program[];
};

export default class TeacherDashboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      programs: [],
    };
  }

  componentDidMount() {
    this.setupPrograms();
  }

  generateProgramList(results: Array<JSONProgram>) {
    const programs = Array<Program>(results.length);
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const name = r.name + " " + r.edition;
      const url = r.name + "/" + r.edition + "/dashboard";
      let p: Program = { name: name, url: url };
      programs[i] = p;
    }
    return programs;
  }

  setupPrograms() {
    axiosInstance.get(teacherDashboardEndpoint).then(res => {
      this.setState({ programs: this.generateProgramList(res.data.results) });
    });
  }

  render() {
    return (
      <div className="container">
        <h1 className="has-text-centered is-size-2">Teacher Dashboard for {this.props.username}</h1>
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <h2 className="has-text-centered is-size-3">Active Programs</h2>
            {this.state.programs.map((program, index) => {
              return (
                <h3 className="is-size-5" key={index}>
                  {program.name}: <Link to={program.url}>Register</Link>
                </h3>
              );
            })}
            <br />
            <h2 className="has-text-centered is-size-3">Previous Programs</h2>
            <h3 className="is-size-5"> None </h3>
          </div>
        </div>
      </div>
    );
  }
}
