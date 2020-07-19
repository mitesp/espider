import React, { Component } from "react";
import axiosInstance from "./axiosAPI";
import { timeslotEndpoint } from "./apiEndpoints";

type Props = {
  programName: string;
  programEdition: string;
};

type State = {
  timeslots: string[];
  classrooms: string[];
  classes: string[];
};

export default class Scheduler extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      timeslots: [],
      classrooms: [],
      classes: [],
    };
  }

  componentDidMount() {
    this.setupClasses();
    this.setupTimeslots();
    this.setupClassrooms();
  }

  setupClasses() {
    // TODO get list of classes
  }

  setupTimeslots() {
    axiosInstance
      .get(`/${this.props.programName}/${this.props.programEdition}/${timeslotEndpoint}`)
      .then(res => {
        this.setState({
          timeslots: res.data,
        });
      });
  }

  setupClassrooms() {
    // TODO get program classrooms
  }

  render() {
    return (
      <div className="container content">
        <div className="columns">
          <div className="column has-text-centered has-background-success-light">
            <h1>
              Scheduler for {this.props.programName} {this.props.programEdition}
            </h1>
            <div className="table-container">
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th></th>
                    {this.state.timeslots.map((timeslot, index) => {
                      return <th key={"timeslot" + index}>{timeslot}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {this.state.classrooms.map((classroom, index) => {
                    return (
                      <tr key={"classroom" + index}>
                        <th>{"classroom" + index}</th>
                        {this.state.timeslots.map((timeslot, index) => {
                          return <th key={"classroom" + index + "timeslot" + index}>{timeslot}</th>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="column is-3 has-text-centered">Insert class list here</div>
        </div>
      </div>
    );
  }
}
