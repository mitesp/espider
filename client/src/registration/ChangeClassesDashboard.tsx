import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { Class } from "./types";
import { studentScheduleEndpoint, classCatalogEndpoint } from "../apiEndpoints";

type Props = {
  loggedIn: boolean;
  username: string;
  program: string;
  edition: string;
};

type State = {
  catalog: Class[];
  enrolledClasses: string[];
  timeslots: string[];
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
    axiosInstance
      .get(`/${this.props.program}/${this.props.edition}/${studentScheduleEndpoint}`)
      .then(res => {
        this.setState({
          timeslots: res.data.timeslots,
          enrolledClasses: res.data.classes,
        });
      });
  }

  setupClassCatalog() {
    axiosInstance
      .get(`/${this.props.program}/${this.props.edition}/${classCatalogEndpoint}`)
      .then(res => {
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
                      TODO enrolledClasses is Class[] instead of string[] */}
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

  enrolledInClass(clazz: Class) {
    return false;
    // TODO will compare internal list of classes and catalog
  }

  addClass(e: React.MouseEvent, clazz: Class) {
    e.preventDefault();
    console.log("Adding " + clazz.title);
    // TODO make this functional
  }

  removeClass(e: React.MouseEvent, clazz: Class) {
    e.preventDefault();
    console.log("Removing " + clazz.title);
    // TODO make this functional
  }

  toggleClassDescription(e: React.MouseEvent) {
    e.preventDefault();
    e!.currentTarget!.parentElement!.nextElementSibling!.classList.toggle("is-hidden");
    // TODO do this in a better way than DOM manipulation
  }

  renderClass(clazz: Class) {
    const classHasSpace = clazz.capacity - clazz.section_set[0].num_students > 0;
    return (
      <div className="card" key={clazz.id}>
        <div className="card-header">
          <a href="# " className="card-header-title" onClick={this.toggleClassDescription}>
            {clazz.title}
          </a>
          <a
            href="#void"
            role="button"
            className="card-header-icon card-toggle"
            onClick={this.toggleClassDescription}
          >
            <span className="icon">
              <i className="fas fa-angle-down"></i>
            </span>
          </a>
        </div>
        <div className="card-content is-hidden">
          <div className="content">
            <p>
              <i>{clazz.teachers.join(", ")}</i>
            </p>
            <p>{clazz.description}</p>
          </div>
        </div>
        <div className="card-footer">
          {
            <a
              href="#void"
              className="card-footer-item"
              role="button"
              onClick={e => this.addClass(e, clazz)}
            >
              Add Class
            </a>
          ) : (
            <a href="# " className="card-footer-item">
              Join waitlist
            </a>
          )}
          <h3 className="card-footer-item">
            {classHasSpace
              ? `${clazz.section_set[0].num_students}/${clazz.capacity} students`
              : "Class is full"}
          </h3>
        </footer>
      </div>
    );
  }

  renderClassCatalog() {
    return (
      <div className="column">
        <h2 className="has-text-centered is-size-3">Class Catalog</h2>
        {renderTextInSection("Insert filter options here")}
        {this.state.catalog.map(clazz => this.renderClass(clazz))}
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
