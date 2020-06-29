import React, { Component } from "react";
import axiosInstance from "../axiosAPI";

type Props = {
  loggedIn: boolean;
  username: string;
  program: string;
  edition: string;
};

type State = {
  timeslots: string[];
  classes: string[];
};

// helper functions

//mostly used for placeholders
function renderTextInSection(displayedText: string, centered = false) {
  return (
    <h3 className={"is-size-5" + (centered ? " has has-text-centered" : "")}>{displayedText}</h3>
  );
}

function renderLinkedText(displayedText: string, url: string) {
  return (
    <h3 className="is-size-5 has-text-centered">
      <a href={url}>{displayedText}</a>
    </h3>
  );
}

class StudentRegDashboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      timeslots: [],
      classes: [],
    };
  }

  componentDidMount() {
    this.getStudentClasses();
  }

  getStudentClasses() {
    axiosInstance
      .get("/studentclasses/", {
        params: {
          program: this.props.program,
          edition: this.props.edition,
        },
      })
      .then(res => {
        this.setState({
          timeslots: res.data.timeslots,
          classes: res.data.classes,
        });
      });
  }

  renderClassSchedule() {
    // tables might not be very accessible
    return (
      <div className="table-container">
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <th>Time</th>
            <th>Class</th>
          </thead>
          <tbody>
            {this.state.classes.map((clazz, index) => {
              return (
                <tr>
                  <th>{this.state.timeslots[index]}</th>
                  <td>{clazz}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  renderClassStatus() {
    return (
      <div className="column is-6">
        <h2 className="has-text-centered is-size-3">Classes</h2>
        {this.renderClassSchedule()}
      </div>
    );
  }

  renderClassCatalog() {
    return (
      <div className="column">
        <h2 className="has-text-centered is-size-3">Class Catalog</h2>
        <br />
        {renderTextInSection("Class catalog here", false)}
      </div>
    );
  }

  render() {
    //TODO block view if studentreg isn't open (or something)
    return (
      <div className="container">
        <h1 className="has-text-centered is-size-2">
          {this.props.program} {this.props.edition}: Change Classes
        </h1>
        <br />
        <div className="columns">
          {this.renderClassStatus()}
          {this.renderClassCatalog()}
        </div>
        {renderLinkedText("Back to Dashboard", "dashboard")}
      </div>
    );
  }
}

export default StudentRegDashboard;
