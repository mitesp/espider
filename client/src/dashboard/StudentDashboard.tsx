import React, { Component } from "react";
import axiosInstance from "../axiosAPI";

// TODO(mvadari): is there a reason registered is optional? is there a better way to organize these
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

  getStudentDashboard() {
    axiosInstance.get("/studentdashboard/").then(res => {
      this.setState({
        programs: res.data.current,
        previousPrograms: res.data.previous,
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
            {this.state.programs.map(program => {
              return (
                <h3 className="is-size-5" key={program.name}>
                  {program.name}:{" "}
                  <a href={program.url}>{!program.registered ? "Register!!" : "Go to Dashboard"}</a>
                </h3>
              );
            })}
            <br />
            <h2 className="has-text-centered is-size-3">Previous Programs</h2>
            {this.state.previousPrograms.map(program => {
              return (
                <h3 className="is-size-5" key={program.name}>
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
