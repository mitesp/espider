import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { Clazz } from "./types";
import { studentScheduleEndpoint, classCatalogEndpoint } from "../apiEndpoints";

type Props = {
  loggedIn: boolean;
  username: string;
  program: string;
  edition: string;
};

type State = {
  scheduleEndpoint: string;
  catalogEndpoint: string;
  timeslots: string[];
  enrolledClasses: string[];
  catalog: Clazz[];
};

// helper functions

//mostly used for placeholders
function renderTextInSection(displayedText: string, centered = false) {
  return <h3 className={"is-size-5" + (centered ? "has-text-centered" : "")}>{displayedText}</h3>;
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
      scheduleEndpoint: `/${this.props.program}/${this.props.edition}/${studentScheduleEndpoint}`,
      catalogEndpoint: `/${this.props.program}/${this.props.edition}/${classCatalogEndpoint}`,
      timeslots: [],
      enrolledClasses: [],
      catalog: [],
    };
  }

  componentDidMount() {
    this.setupStudentClasses();
    this.setupClassCatalog();
  }

  setupStudentClasses() {
    axiosInstance.get(this.state.scheduleEndpoint).then(res => {
      this.setState({
        timeslots: res.data.timeslots,
        enrolledClasses: res.data.classes,
      });
    });
  }

  setupClassCatalog() {
    axiosInstance.get(this.state.catalogEndpoint).then(res => {
      this.setState({
        catalog: res.data,
      });
    });
  }

  renderClassSchedule() {
    return (
      <div className="column is-6">
        <h2 className="has-text-centered is-size-3">Classes</h2>
        <div className="table-container">
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>Time</th>
                <th>Class</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.enrolledClasses.map((clazz, index) => {
                return (
                  <tr key={index}>
                    <th>{this.state.timeslots[index]}</th>
                    <td>{clazz}</td>
                    <td>
                      <button className="delete is-centered"></button>
                      {/*(for a) onClick=e => this.removeClass(e, clazz)
                      TODO enrolledClasses is Clazz[] instead of string[] */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  enrolledInClass(clazz: Clazz) {
    return false;
  }

  addClass(e: React.MouseEvent, clazz: Clazz) {
    console.log("Adding " + clazz.title);
    // TODO make this functional
  }

  removeClass(e: React.MouseEvent, clazz: Clazz) {
    console.log("Removing " + clazz.title);
    // TODO make this functional
  }

  toggleClassDescription(e: React.MouseEvent) {
    e!.currentTarget!.parentElement!.nextElementSibling!.classList.toggle("is-hidden");
  }

  renderClass(clazz: Clazz) {
    return (
      <div className="card" key={clazz.id}>
        <header className="card-header">
          <h2 className="card-header-title">{clazz.title}</h2>
          <a
            href="# "
            className="card-header-icon card-toggle"
            onClick={this.toggleClassDescription}
          >
            <span className="icon">
              <i className="fas fa-angle-down"></i>
            </span>
          </a>
        </header>
        <div className="card-content is-hidden">
          <div className="content">
            <p>
              <i>{clazz.teachers.join(", ")}</i>
            </p>
            <p>{clazz.description}</p>
          </div>
        </div>
        <footer className="card-footer">
          {
            <a href="# " className="card-footer-item" onClick={e => this.addClass(e, clazz)}>
              Add Class
            </a>
          }
          <h3 className="card-footer-item">{`${clazz.capacity} students`}</h3>
        </footer>
      </div>
    );
  }

  renderClassCatalog() {
    return (
      <div className="column">
        <h2 className="has-text-centered is-size-3">Class Catalog</h2>
        {renderTextInSection("Insert filter options here")}
        {this.state.catalog.map((clazz, index) => this.renderClass(clazz))}
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
          {this.renderClassSchedule()}
          {this.renderClassCatalog()}
        </div>
        {renderLinkedText("Back to Dashboard", "dashboard")}
      </div>
    );
  }
}

export default StudentRegDashboard;
