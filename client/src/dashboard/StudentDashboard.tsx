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
  loggedIn: boolean;
  isStudent: boolean;
  username: string;
};

type State = {
  programs: Program[];
};

class StudentDashboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      programs: [],
    };
  }

  componentDidMount() {
    if (this.props.loggedIn) {
      this.getPrograms();
    }
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
    if (this.props.loggedIn) {
      axiosInstance.get("/programs/").then(res => {
        this.setState({ programs: this.generateProgramList(res.data.results) });
      });
    }
  }

  studentDashboard() {
    return (
      <div className="container">
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
      </div>
    );
  }

  notStudent() {
    return <div>DASHBOARD</div>;
  }

  render() {
    return <div>{this.props.isStudent ? this.studentDashboard() : this.notStudent()}</div>;
  }
}

export default StudentDashboard;
