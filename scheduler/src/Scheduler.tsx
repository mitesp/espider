import React, { Component } from "react";

export default class Scheduler extends Component<{}, {}> {
  constructor(props: {}) {
    super(props);
    this.state = {};
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
