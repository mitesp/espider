import React, { Component } from "react";
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

export default class StudentDashboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      programs: [],
    };
  }

  componentDidMount() {
    this.getPrograms();
  }

  generateProgramList(results: Array<JSONProgram>) {
    const programs = Array<Program>(results.length);
    let counter = 0;
    results.forEach(function (r) {
      const name = r.name + " " + r.edition;
      const url = r.name + "_" + r.edition;
      let p: Program = { name: name, url: url };
      programs[counter] = p;
      counter++;
    });
    return programs;
  }

  getPrograms() {
    axiosInstance.get("/programs/").then(res => {
      this.setState({ programs: this.generateProgramList(res.data.results) });
    });
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-6 is-offset-3">
          <h1 className="has-text-centered is-size-2">
            Student Dashboard for {this.props.username}
          </h1>
          <h2 className="has-text-centered is-size-3">Active Programs</h2>
          {this.state.programs.map((p, index) => {
            return (
              <h3 className="is-size-5" key={p.name}>
                {p.name}: <a href={p.url}>Register</a>
              </h3>
            );
          })}
          <br />
          <h2 className="has-text-centered is-size-3">Previous Programs</h2>
          <h3 className="is-size-5"> None </h3>
        </div>
      </div>
    );
  }
}
