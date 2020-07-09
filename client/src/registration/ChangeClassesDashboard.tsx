import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { Class, Section } from "./types";
import { studentScheduleEndpoint, classCatalogEndpoint } from "../apiEndpoints";
import "./Catalog.css";

type Props = {
  loggedIn: boolean;
  username: string;
  program: string;
  edition: string;
};

type State = {
  catalog: Class[];
  catalogClassStatuses: { [classId: string]: number }; // classID -> selected section
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
      catalog: [],
      catalogClassStatuses: {},
      enrolledClasses: [],
      timeslots: [],
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
    const sectionNum = this.state.catalogClassStatuses[clazz.id];
    if (sectionNum !== undefined) {
      console.log(`Adding "${clazz.title}" section ${sectionNum}`);
      // TODO make this functional
      // TODO refresh page or API calls
    }
  }

  addWaitlistSection(e: React.MouseEvent, clazz: Class) {
    e.preventDefault();
    const sectionNum = this.state.catalogClassStatuses[clazz.id];
    if (sectionNum !== undefined) {
      console.log(`Adding to waitlist "${clazz.title}" section ${sectionNum}`);
      // TODO make this functional
    }
  }

  removeSection(e: React.MouseEvent, section: Section) {
    e.preventDefault();
    if (section) {
      console.log(`Removing "${section.number}"`);
      // TODO make this functional
      // TODO refresh page or API calls
    }
  }

  changeSelectedSection(e: React.MouseEvent, clazz: Class, sectionNum: number) {
    e.preventDefault();
    const newCatalogClassStatuses = { ...this.state.catalogClassStatuses };
    newCatalogClassStatuses[clazz.id] = sectionNum;
    this.setState({ catalogClassStatuses: newCatalogClassStatuses });
  }

  renderAddClassDropdown(clazz: Class) {
    const sectionNum = this.state.catalogClassStatuses[clazz.id];
    return (
      <div className="card-footer-item">
        <div className="dropdown is-hoverable is-fullwidth">
          <div className="dropdown-trigger is-fullwidth">
            <button className="button is-fullwidth">
              <span>
                {sectionNum !== undefined
                  ? clazz.sections[0].scheduledblock_set.join(" / ")
                  : "Sections"}
              </span>
              {/*TODO show whole timespan of section as one block*/}
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
                    onClick={e => this.changeSelectedSection(e, clazz, index)}
                  >
                    {section.scheduledblock_set.join(" / ")}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        {/*TODO add relevant text */}
      </div>
    );
  }

  toggleClassDescription(e: React.MouseEvent) {
    e.preventDefault();
    e!.currentTarget!.parentElement!.nextElementSibling!.classList.toggle("is-hidden");
    // TODO do this in a better way than DOM manipulation
  }

  renderClass(clazz: Class) {
    const sectionNum = this.state.catalogClassStatuses[clazz.id];
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
            {sectionNum !== undefined
              ? clazz.capacity - clazz.sections[sectionNum].num_students > 0 // has space
                ? `${clazz.sections[sectionNum].num_students}/${clazz.capacity} students`
                : "Class is full"
              : `Capacity ${clazz.capacity} students`
            }
          </h3>
          {sectionNum !== undefined ? (
            clazz.capacity - clazz.sections[sectionNum].num_students > 0 ? ( // has space
              <a
                href="#void"
                className="card-footer-item ml-4"
                onClick={e => this.addSection(e, clazz)}
              >
                Add class
              </a>
            ) : (
              <a
                href="#void"
                className="card-footer-item ml-4"
                onClick={e => this.addWaitlistSection(e, clazz)}
              >
                Join waitlist
              </a>
            )
          ) : (
            <div />
          )}
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
