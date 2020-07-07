import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { Class, Section } from "./types";
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
    // TODO do more detailed JSON parsing
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

  addSection(e: React.MouseEvent, clazz: Class) {
    e.preventDefault();
    console.log(`Adding ${clazz.title}`);
    // TODO collect section number
    // TODO refresh page or API calls
  }

  addWaitlistSection(e: React.MouseEvent, clazz: Class) {
    e.preventDefault();
    console.log("Adding to waitlist " + clazz.title);
  }

  removeClass(e: React.MouseEvent, section: Section) {
    e.preventDefault();
    if (section) {
      console.log("Removing " + section.number);
      // TODO make this functional
      // TODO refresh page or API calls
    }
  }

  renderAddClassDropdown(clazz: Class) {
    return (
      <div className="card-footer-item">
        <div className="dropdown is-hoverable mr-4">
          <div className="dropdown-trigger">
            <button className="button">
              <span>Sections</span>
              {/*TODO show selected section*/}
              <span className="icon is-small">
                <i className="fas fa-angle-down"></i>
              </span>
            </button>
          </div>
          <div className="dropdown-menu">
            <div className="dropdown-content">
              {clazz.sections.map((section, index) => {
                return (
                  <a
                    href="#void"
                    key={index}
                    className="dropdown-item"
                    onClick={e => this.addSection(e, clazz)}
                  >
                    {section.scheduledblock_set.join(" / ")}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        {/*TODO replace button with "waitlist" button if no space in the chosen section*/}
        {/*TODO add relevant text */}
        <button className="button" onClick={e => this.addSection(e, clazz)}>
          Add class
        </button>
      </div>
    );
  }

  toggleClassDescription(e: React.MouseEvent) {
    e.preventDefault();
    e!.currentTarget!.parentElement!.nextElementSibling!.classList.toggle("is-hidden");
    // TODO do this in a better way than DOM manipulation
  }

  renderClass(clazz: Class) {
    const classHasSpace = clazz.capacity - clazz.sections[0].num_students > 0;
    // TODO replace this with something that actually checks this once sections have been
    // properly implemented
    return (
      <div className="card" key={clazz.id}>
        <div className="card-header">
          <a href="#void" className="card-header-title" onClick={this.toggleClassDescription}>
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
          {this.renderAddClassDropdown(clazz)}
          <h3 className="card-footer-item">
            {
              /* TODO show details from the chosen section or something*/
              classHasSpace
                ? `${clazz.sections[0].num_students}/${clazz.capacity} students`
                : "Class is full"
            }
          </h3>
        </div>
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
