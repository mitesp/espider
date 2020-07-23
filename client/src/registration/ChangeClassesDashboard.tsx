import React, { useCallback, useEffect, useState } from "react";

import { Class, ScheduleItem, Section } from "./types";

import {
  studentScheduleEndpoint,
  classCatalogEndpoint,
  studentRemoveClassesEndpoint,
} from "../apiEndpoints";
import axiosInstance from "../axiosAPI";
import { renderCustomInput } from "../forms/helpers";
import { renderLinkedText, renderTextInSection } from "../helperTextFunctions";
import { generalPage } from "../layout/Page";

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

function ClassChangesDashboard(props: Props) {
  const [schedule, setSchedule] = useState([] as ScheduleItem[]);

  const [catalog, setCatalog] = useState([] as Class[]);
  const [displayedCatalog, setDisplayedCatalog] = useState([] as Class[]);

  const [classSearchQuery, setClassSearchQuery] = useState("");
  const [displayOnlyOpenClasses, setDisplayOnlyOpenClasses] = useState(false);

  const setupStudentClasses = useCallback(() => {
    axiosInstance
      .get(`/${props.program}/${props.edition}/${studentScheduleEndpoint}`, {
        params: {
          include_empty_timeslots: true,
        },
      })
      .then(res => {
        setSchedule(res.data);
      });
  }, [props.edition, props.program]);

  useEffect(() => {
    // set up student schedule
    setupStudentClasses();
    // set up class catalog
    axiosInstance.get(`/${props.program}/${props.edition}/${classCatalogEndpoint}`).then(res => {
      setCatalog(res.data);
      setDisplayedCatalog(res.data);
    });
  }, [props.edition, props.program, setupStudentClasses]);

  function renderClassSchedule() {
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
              {schedule.map((scheduleItem, index) => {
                return (
                  <tr key={index}>
                    <th>{scheduleItem.timeslot}</th>
                    <td>{scheduleItem.section && scheduleItem.section.name}</td>
                    <td>
                      {scheduleItem.section && (
                        <button
                          onClick={e => removeSection(e, scheduleItem.section)}
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
        {renderLinkedText("Back to Dashboard", "../dashboard")}
      </div>
    );
  }

  function addClass(e: React.MouseEvent, clazz: Class) {
    e.preventDefault(); // TODO use button instead of anchor so this isn't needed
    console.log("Adding " + clazz.title);
    // TODO make this functional
  }

  function addWaitlistClass(e: React.MouseEvent, clazz: Class) {
    e.preventDefault();
    console.log("Adding to waitlist " + clazz.title);
    // TODO make this functional
  }

  function removeSection(e: React.MouseEvent, section: Section) {
    // TODO add some kind of "Are you sure?" message
    e.preventDefault(); // TODO use button instead of anchor so this isn't needed
    if (section) {
      axiosInstance
        .post(`/${props.program}/${props.edition}/${studentRemoveClassesEndpoint}`, {
          class: section.clazz,
          section: section.number,
        })
        .then(res => {
          // TODO error handling
          setupStudentClasses();
        });
      // TODO refresh catalog (if catalog doesn't include classes that the student is in)
    }
  }

  function toggleClassDescription(e: React.MouseEvent) {
    e.preventDefault(); // TODO use button instead of anchor so this isn't needed
    e!.currentTarget!.parentElement!.nextElementSibling!.classList.toggle("is-hidden");
    // TODO do this in a better way than DOM manipulation
  }

  function renderClass(clazz: Class) {
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
            onClick={toggleClassDescription}
          >
            {clazz.title}
          </a>
          <a
            href="#void"
            className="card-header-icon card-toggle"
            role="button"
            onClick={toggleClassDescription}
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
              onClick={e => addClass(e, clazz)}
            >
              Add Class
            </a>
          ) : (
            <a
              href="#void"
              className="card-footer-item"
              role="button"
              onClick={e => addWaitlistClass(e, clazz)}
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
  }

  function handleSearchChange(e: React.FormEvent<HTMLInputElement>) {
    setClassSearchQuery(e.currentTarget.value);
  }

  function textContainsQuery(text: string, query: string) {
    return text.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  }

  function classContainsQuery(clazz: Class, query: string) {
    return textContainsQuery(clazz.title, query) || textContainsQuery(clazz.description, query);
  }

  function submitSearch(e: React.MouseEvent<HTMLButtonElement>) {
    setDisplayedCatalog(catalog.filter(clazz => classContainsQuery(clazz, classSearchQuery)));
    // TODO make search functionality better/more useful
    // TODO consider doing this on edit/removing the button
  }

  function filterOpenClasses(e: React.MouseEvent<HTMLButtonElement>) {
    displayOnlyOpenClasses // previous state
      ? console.log("Open class filter off")
      : console.log("Open class filter on");
    // TODO make this functional
    e!.currentTarget!.classList.toggle("is-success");
    setDisplayOnlyOpenClasses(!displayOnlyOpenClasses);
  }

  function renderClassCatalog() {
    return (
      <div className="column">
        <h2 className="has-text-centered is-size-3">Class Catalog</h2>
        <div className="field is-horizontal">
          <div className="field-body">
            <div className="field">
              <div className="control is-expanded">
                {renderCustomInput(
                  handleSearchChange,
                  "Search for Class",
                  "search",
                  classSearchQuery,
                  "text",
                  "search"
                )}
              </div>
            </div>
            <button className="button is-info" onClick={submitSearch}>
              Search
            </button>
          </div>
        </div>
        <button className="button mb-4 is-success" onClick={filterOpenClasses}>
          Only open classes
        </button>
        {/*TODO add more filters*/}
        {displayedCatalog.length > 0
          ? displayedCatalog.map(renderClass)
          : renderTextInSection("No classes match your search filters.", true)}
      </div>
    );
  }

  //TODO block view if studentreg isn't open (or something)
  return generalPage(`${props.program} ${props.edition} Class Changes Dashboard | MIT ESP`)(
    <React.Fragment>
      <h1 className="has-text-centered is-size-2">
        {props.program} {props.edition}: Change Classes
      </h1>
      <br />
      <div className="columns">
        {renderClassSchedule()}
        {renderClassCatalog()}
      </div>
    </React.Fragment>
  );
}

export default ClassChangesDashboard;
