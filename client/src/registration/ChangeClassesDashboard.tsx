import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { Class, Section, ScheduledTimeslot } from "./types";
import { studentScheduleEndpoint, classCatalogEndpoint } from "../apiEndpoints";
import { renderCustomInput } from "../forms/helpers";
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
  openClasses: boolean;
  schedule: ScheduledTimeslot[];
  searchClassQuery: string;
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

class StudentRegDashboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      catalog: [],
      catalogClassStatuses: {},
      enrolledClasses: [],
      openClasses: true,
      searchClassQuery: "",
      schedule: [],
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
          schedule: res.data,
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
              {this.state.schedule.map((scheduleItem, index) => {
                return (
                  <tr key={index}>
                    <th>{scheduleItem.timeslot}</th>
                    <td>{scheduleItem.section && scheduleItem.section.name}</td>
                    <td>
                      {scheduleItem.section && (
                        <button
                          onClick={e => this.removeSection(e, scheduleItem.section)}
                          className="delete is-centered"
                        ></button>
                      )}
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
    e.preventDefault();
    const sectionNum = this.state.catalogClassStatuses[clazz.id];
    if (sectionNum !== undefined) {
      axiosInstance
        .post(`/${this.props.program}/${this.props.edition}/${studentScheduleEndpoint}`, {
          action: "add",
          class: clazz.id,
          section: sectionNum + 1, // convert from 0-indexing to 1-indexing
        })
        .then(res => {
          console.log(res.data);
          this.setState({
            schedule: res.data,
          });
        });
      // TODO refresh catalog (if catalog doesn't include classes that the student is in)
    }
  }

  addWaitlistSection(e: React.MouseEvent, clazz: Class) {
    e.preventDefault();
    const sectionNum = this.state.catalogClassStatuses[clazz.id];
    if (sectionNum !== undefined) {
      console.log(`Adding to waitlist "${clazz.title}"" section ${sectionNum}`);
      // TODO make this functional
    }
  }

  removeSection(e: React.MouseEvent, section: Section) {
    e.preventDefault();
    if (section) {
      console.log(`Removing "${section.name}"`);
      // TODO make this functional
      // TODO refresh page or API calls
    }
  }

  toggleClassDescription(e: React.MouseEvent) {
    e.preventDefault();
    e!.currentTarget!.parentElement!.nextElementSibling!.classList.toggle("is-hidden");
    // TODO do this in a better way than DOM manipulation
  }

  toggleAddClassDropdown(e: React.MouseEvent) {
    e.preventDefault();
    e!.currentTarget!.parentElement!.nextElementSibling!.classList.toggle("is-hidden");
    // TODO do this in a better way than DOM manipulation
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
          <div className="dropdown-trigger">
            <button className="button is-fullwidth" onClick={this.toggleAddClassDropdown}>
              <span>
                {sectionNum !== undefined
                  ? clazz.section_set[0].scheduledblock_set.join(" / ")
                  : "Sections"}
              </span>
              {/*TODO show whole timespan of section as one block*/}
              <span className="icon is-small">
                <i className="fas fa-angle-down"></i>
              </span>
            </button>
          </div>
          <div className="dropdown-menu is-hidden">
            <div className="dropdown-content">
              {clazz.section_set.map((section, index) => {
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

  renderClass(clazz: Class) {
    const sectionNum = this.state.catalogClassStatuses[clazz.id];
    return (
      <div className="card mb-1" key={clazz.id}>
        <div className="card-header">
          <a
            href="#void"
            className="card-header-title"
            role="button"
            onClick={this.toggleClassDescription}
          >
            {clazz.title}
          </a>
          <a
            href="#void"
            className="card-header-icon card-toggle"
            role="button"
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
              ? clazz.capacity - clazz.section_set[sectionNum].num_students > 0 // has space
                ? `${clazz.section_set[sectionNum].num_students}/${clazz.capacity} students`
                : "Class is full"
              : `Capacity ${clazz.capacity} students`}
          </h3>
          {sectionNum !== undefined ? (
            clazz.capacity - clazz.section_set[sectionNum].num_students > 0 ? ( // has space
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

  handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      searchClassQuery: e.currentTarget.value,
    });
  };

  submitSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Searching for " + this.state.searchClassQuery);
    // TODO make this functional
  };

  filterOpenClasses = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.state.openClasses // previous state
      ? console.log("Open class filter off")
      : console.log("Open class filter on");
    // TODO make this filtering functional

    e!.currentTarget!.classList.toggle("is-success");
    this.setState({
      openClasses: !this.state.openClasses,
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
                  this.state.searchClassQuery,
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

export default StudentRegDashboard;
