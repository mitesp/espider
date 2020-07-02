import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { Clazz } from "./types";

type Props = {
  loggedIn: boolean;
  username: string;
  program: string;
  edition: string;
};

type State = {
  timeslots: string[];
  classes: string[];
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
      timeslots: [],
      classes: [],
      catalog: [],
    };
  }

  componentDidMount() {
    this.getStudentClasses();
    this.getClassCatalog();
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

  getClassCatalog() {
    axiosInstance.get(`/${this.props.program}/${this.props.edition}/catalog/`).then(res => {
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
              </tr>
            </thead>
            <tbody>
              {this.state.classes.map((clazz, index) => {
                return (
                  <tr key={index}>
                    <th>{this.state.timeslots[index]}</th>
                    <td>{clazz}</td>
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
  }

  removeClass(e: React.MouseEvent, clazz: Clazz) {
    console.log("Removing " + clazz.title);
  }

  toggleClassDescription(e: React.MouseEvent) {
    e!.currentTarget!.parentElement!.nextElementSibling!.classList.toggle("is-hidden");
  }

  renderClass(clazz: Clazz) {
    const classHasSpace = clazz.capacity - clazz.num_students > 0;
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
          {this.enrolledInClass(clazz) ? (
            <a href="# " className="card-footer-item" onClick={e => this.removeClass(e, clazz)}>
              Remove Class
            </a>
          ) : classHasSpace ? (
            <a href="# " className="card-footer-item" onClick={e => this.addClass(e, clazz)}>
              Add Class
            </a>
          ) : (
            <a href="# " className="card-footer-item">
              Join waitlist
            </a>
          )}
          <h3 className="card-footer-item">
            {classHasSpace ? `${clazz.num_students}/${clazz.capacity} students` : "Class is full"}
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
