import React, { Component } from "react";

import { Class, ScheduleItem, Section } from "./types";

import { classCatalogEndpoint, studentScheduleEndpoint } from "../apiEndpoints";
import axiosInstance from "../axiosAPI";
import { renderCustomInput } from "../forms/helpers";
import { renderLinkedText, renderTextInSection } from "../helperTextFunctions";

type Props = {
  username: string;
  program: string;
  edition: string;
};

type State = {
  catalog: Class[];
  classSearchQuery: string;
  displayedCatalog: Class[];
  displayOnlyOpenClasses: boolean;
  schedule: ScheduleItem[];
};

class ClassChangesDashboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      catalog: [],
      classSearchQuery: "",
      displayedCatalog: [],
      displayOnlyOpenClasses: true,
      schedule: [],
    };
  }

  componentDidMount() {
    this.setupStudentClasses();
    this.setupClassCatalog();
  }

  setupStudentClasses() {
    axiosInstance
      .get(`/${this.props.program}/${this.props.edition}/${studentScheduleEndpoint}`, {
        params: {
          include_empty_timeslots: true,
        },
      })
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
          displayedCatalog: res.data,
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
                          onClick={e => this.removeClass(e, scheduleItem.section)}
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
    e.preventDefault(); // TODO use button instead of anchor so this isn't needed
    console.log("Adding " + clazz.title);
    // TODO make this functional
  }

  addWaitlistClass(e: React.MouseEvent, clazz: Class) {
    e.preventDefault();
    console.log("Adding to waitlist " + clazz.title);
    // TODO make this functional
  }

  removeClass(e: React.MouseEvent, section: Section) {
    e.preventDefault(); // TODO use button instead of anchor so this isn't needed
    if (section) {
      console.log("Removing " + section.name);
      // TODO make this functional
    }
  }

  toggleClassDescription(e: React.MouseEvent) {
    e.preventDefault(); // TODO use button instead of anchor so this isn't needed
    e!.currentTarget!.parentElement!.nextElementSibling!.classList.toggle("is-hidden");
    // TODO do this in a better way than DOM manipulation
  }

  renderClass = (clazz: Class) => {
    const classHasSpace = clazz.capacity - clazz.sections[0].num_students > 0;
    // TODO replace this with something that actually checks this once sections have been
    // properly implemented
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
            <a
              href="#void"
              className="card-footer-item"
              role="button"
              onClick={e => this.addWaitlistClass(e, clazz)}
            >
              Join waitlist
            </a>
          )}
          <h3 className="card-footer-item">
            {classHasSpace
              ? `${clazz.sections[0].num_students}/${clazz.capacity} students`
              : // TODO this shouldn't refer to just the first section
                "Class is full"}
          </h3>
        </div>
      </div>
    );
  };

  handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      classSearchQuery: e.currentTarget.value,
    });
  };

  textContainsQuery = (text: string, query: string) => {
    return text.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  classContainsQuery = (clazz: Class, query: string) => {
    return (
      this.textContainsQuery(clazz.title, query) || this.textContainsQuery(clazz.description, query)
    );
  };

  submitSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      displayedCatalog: this.state.catalog.filter(clazz =>
        this.classContainsQuery(clazz, this.state.classSearchQuery)
      ),
    });
    // TODO make search functionality better/more useful
    // TODO consider doing this on edit/removing the button
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
        {this.state.displayedCatalog.length > 0
          ? this.state.displayedCatalog.map(this.renderClass)
          : renderTextInSection("No classes match your search filters.", true)}
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
