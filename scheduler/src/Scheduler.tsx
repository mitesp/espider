import React, { Component } from "react";

type State = {
  timeslots: string[];
  classrooms: string[];
  classes: string[];
};

export default class Scheduler extends Component<{}, {}> {
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
            Insert scheduler here
          </div>
          <div className="column is-3 has-text-centered">Insert class list here</div>
        </div>
      </div>
    );
  }
}
