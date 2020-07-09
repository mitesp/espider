import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { Class, ScheduledTimeslot } from "./types";
import { studentScheduleEndpoint, classCatalogEndpoint } from "../apiEndpoints";
import { renderCustomInput } from "../forms/helpers";

type Props = {
  loggedIn: boolean;
  username: string;
  program: string;
  edition: string;
};

type State = {
  catalog: Class[];
  enrolledClasses: string[];
  openClasses: boolean;
  schedule: ScheduledTimeslot[];
  search: string;
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
      enrolledClasses: [],
      catalog: [],
      openClasses: true,
      search: "",
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
                    <td>{scheduleItem.clazz && scheduleItem.clazz.title}</td>
                    <td>
                      {scheduleItem.clazz && (
                        <button
                          onClick={e => this.removeClass(e, scheduleItem.clazz)}
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

  addClass(e: React.MouseEvent, clazz: Class) {
    e.preventDefault();
    console.log("Adding " + clazz.title);
    // TODO make this functional
  }

  removeClass(e: React.MouseEvent, clazz: Class) {
    e.preventDefault();
    if (clazz) {
      console.log("Removing " + clazz.title);
      // TODO make this functional
    }
  }

  toggleClassDescription(e: React.MouseEvent) {
    e.preventDefault();
    e!.currentTarget!.parentElement!.nextElementSibling!.classList.toggle("is-hidden");
    // TODO do this in a better way than DOM manipulation
  }

  renderClass(clazz: Class) {
    const classHasSpace = clazz.capacity - clazz.section_set[0].num_students > 0;
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
          {classHasSpace ? (
            <a
              href="#void"
              className="card-footer-item"
              role="button"
              onClick={e => this.addClass(e, clazz)}
            >
              Add Class
            </a>
          ) : (
            <a href="#void" className="card-footer-item" role="button">
              Join waitlist
            </a>
          )}
          <h3 className="card-footer-item">
            {classHasSpace
              ? `${clazz.section_set[0].num_students}/${clazz.capacity} students`
              : "Class is full"}
          </h3>
        </div>
      </div>
    );
  }

  handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      search: e.currentTarget.value,
    });
  };

  submitSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Searching for " + this.state.search);
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
                  this.state.search,
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
