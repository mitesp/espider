import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { Class, Section } from "./types";
import { studentScheduleEndpoint, classCatalogEndpoint } from "../apiEndpoints";
import "./Catalog.css";
import { renderCustomInput } from "../forms/helpers";

type Props = {
  username: string;
  program: string;
  edition: string;
};

type State = {
  catalog: Class[];
  classSearchQuery: string;
  displayOnlyOpenClasses: boolean;
  enrolledClasses: string[];
  timeslots: string[];
};

// helper functions

//mostly used for placeholders

function renderLinkedText(displayedText: string, url: string) {
  return (
    <h3 className="is-size-5 has-text-centered">
      <a href={url}>{displayedText}</a>
    </h3>
  );
}

class ClassChangesDashboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      catalog: [],
      classSearchQuery: "",
      displayOnlyOpenClasses: true,
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
        {renderLinkedText("Back to Dashboard", "dashboard")}
      </div>
    );
  }

  enrolledInClass(clazz: Class) {
    return false;
    // TODO will compare internal list of classes and catalog
  }

  addSection(e: React.MouseEvent, clazz: Class) {
    e.preventDefault(); // TODO use button instead of anchor so this isn't needed
    console.log(`Adding ${clazz.title}`);
    // TODO collect section number
    // TODO refresh page or API calls
  }

  addWaitlistSection(e: React.MouseEvent, clazz: Class) {
    e.preventDefault(); // TODO use button instead of anchor so this isn't needed
    console.log("Adding to waitlist " + clazz.title);
  }

  removeSection(e: React.MouseEvent, section: Section) {
    e.preventDefault(); // TODO use button instead of anchor so this isn't needed
    if (section) {
      console.log("Removing " + section.number);
      // TODO make this functional
      // TODO refresh page or API calls
    }
  }

  renderAddClassDropdown(clazz: Class) {
    return (
      <div className="card-footer-item">
        <div className="dropdown is-hoverable is-fullwidth">
          <div className="dropdown-trigger is-fullwidth">
            <button className="button is-fullwidth">
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
                    {section.scheduled_blocks.join(" / ")}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        {/*TODO replace button with "waitlist" button if no space in the chosen section*/}
        {/*TODO add relevant text */}
      </div>
    );
  }

  toggleClassDescription(e: React.MouseEvent) {
    e.preventDefault(); // TODO use button instead of anchor so this isn't needed
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
            {classHasSpace
              ? `${clazz.sections[0].num_students}/${clazz.capacity} students`
              : // TODO this shouldn't refer to just the first section
                "Class is full"}
            <button className="button ml-4" onClick={e => this.addSection(e, clazz)}>
              Add class
            </button>
          </h3>
        </div>
      </div>
    );
  }

  handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      classSearchQuery: e.currentTarget.value,
    });
  };

  submitSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Searching for " + this.state.classSearchQuery);
    // TODO make this functional
  };

  filterOpenClasses = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.state.displayOnlyOpenClasses // previous state
      ? console.log("Open class filter off")
      : console.log("Open class filter on");
    // TODO make this functional
    e!.currentTarget!.classList.toggle("is-success");
    this.setState({
      displayOnlyOpenClasses: !this.state.displayOnlyOpenClasses,
    });
  };

  renderClassCatalog() {
    return (
      <div className="column">
        <h2 className="has-text-centered is-size-3">Class Catalog</h2>
        <div className="field is-horizontal">
          <div className="field-body">
            <div className="field">
              <div className="control is-expanded">
                {renderCustomInput(
                  this.handleSearchChange,
                  "Search for Class",
                  "search",
                  this.state.classSearchQuery,
                  "text",
                  "search"
                )}
              </div>
            </div>
            <button className="button is-info" onClick={this.submitSearch}>
              Search
            </button>
          </div>
        </div>
        <button className="button mb-4 is-success" onClick={this.filterOpenClasses}>
          Only open classes
        </button>
        {/*TODO add more filters*/}

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
      </div>
    );
  }
}

export default ClassChangesDashboard;
