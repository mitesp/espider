import React, { Component } from "react";
import axiosInstance from "../axiosAPI";

// TODO(mvadari): is there a reason registered is optional? is there a better way to organize these
// two program objects? could we just make a get_url() function to process a program?
type JSONProgram = {
  name: string;
  edition: string;
  registered?: boolean;
};

type Program = {
  name: string;
  url: string;
  registered?: boolean;
};

type Props = {
  username: string;
};

type State = {
  programs: Program[];
  previousPrograms: Program[];
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
    this.getStudentDashboard();
  }

  generateProgramList(results: Array<JSONProgram>) {
    const programs = Array<Program>(results.length);
    let counter = 0; // TODO(mvadari): I think a for loop is more readable than a forEach?
    results.forEach(function (r) {
      const name = r.name + " " + r.edition;
      const url = r.name + "/" + r.edition + "/dashboard";
      const registered = r.registered;
      let p: Program = { name: name, url: url, registered: registered };
      programs[counter] = p;
      counter++;
    });
    return programs;
  }

  getStudentDashboard() {
    axiosInstance.get("/studentdashboard/").then(res => {
      this.setState({
        programs: this.generateProgramList(res.data.current),
        previousPrograms: this.generateProgramList(res.data.previous),
      });
    });
  }

  render() {
    return (
      <div className="container">
        <h1 className="has-text-centered is-size-2">Student Dashboard for {this.props.username}</h1>
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <h2 className="has-text-centered is-size-3">Active Programs</h2>
            {this.state.programs.map((program, index) => {
              return (
                <h3 className="is-size-5" key={index}>
                  {program.name}:{" "}
                  <a href={program.url}>{program.registered ? "Go to Dashboard" : "Register!!"}</a>
                </h3>
              );
            })}
            <br />
            <h2 className="has-text-centered is-size-3">Previous Programs</h2>
            {this.state.previousPrograms.map((program, index) => {
              return (
                <h3 className="is-size-5" key={index}>
                  {program.name}: <a href={program.url}>View</a>
                </h3>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
