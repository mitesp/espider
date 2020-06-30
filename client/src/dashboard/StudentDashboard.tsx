import React, { Component } from "react";
import axiosInstance from "../axiosAPI";

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
    // TODO add announcements/dates section
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
                  <a href={program.url + "/dashboard"}>
                    {program.registered ? "Go to Dashboard" : "Register!!"}
                  </a>
                </h3>
              );
            })}
            <br />
            <h2 className="has-text-centered is-size-3">Previous Programs</h2>
            {this.state.previousPrograms.map((program, index) => {
              return (
                <h3 className="is-size-5" key={index}>
                  {program.name}: <a href={program.url + "/dashboard"}>View</a>
                </h3>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
