import React, { Component } from "react";

type State = {
  timeslots: string[];
  classrooms: string[];
  classes: string[];
};

export default class Scheduler extends Component<{}, State> {
  constructor(props: {}) {
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
    // TODO get program timeslots
  }

  setupClassrooms() {
    // TODO get program classrooms
  }

  render() {
    return (
      <div className="container content">
        <div className="columns">
          <div className="column has-text-centered has-background-success-light">
            <h1>Scheduler for [Program Name]</h1>
            <div className="table-container">
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th></th>
                    {this.state.timeslots.map((timeslot, index) => {
                      return <th>{timeslot}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {this.state.classrooms.map((classroom, index) => {
                    return (
                      <tr key={index}>
                        <th>{classroom}</th>
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
