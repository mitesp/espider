import React, { useEffect, useState } from "react";

import { RegStatusOption, ScheduleItem } from "./types";

import { studentScheduleEndpoint } from "../apiEndpoints";
import axiosInstance from "../axiosAPI";
import { useAuth } from "../context/auth";
import { renderLinkedText, renderTextInSection } from "../helperTextFunctions";

type Props = {
  program: string;
  edition: string;
  checks: {
    availabilityCheck: boolean;
    emergencyInfoCheck: boolean;
    liabilityCheck: boolean;
    medliabCheck: boolean;
    updateProfileCheck: boolean;
  };
  regStatus: RegStatusOption;
};

// helper functions

function StudentRegDashboard(props: Props) {
  const { username } = useAuth();

  const [schedule, setSchedule] = useState([] as ScheduleItem[]);

  useEffect(() => {
    switch (props.regStatus) {
      case RegStatusOption.ClassPreferences:
        // TODO set up class preferences
        break;

      case RegStatusOption.ChangeClasses ||
        RegStatusOption.PreProgram ||
        RegStatusOption.DayOf ||
        RegStatusOption.PostProgram:
        // Set up student classes
        axiosInstance
          .get(`/${props.program}/${props.edition}/${studentScheduleEndpoint}`)
          .then(res => {
            setSchedule(res.data);
          });
        break;

      default:
        console.log("Something broke :(");
    }
  }, [props.edition, props.program, props.regStatus]);

  function renderClassPrefs(editsAllowed: boolean = false) {
    return (
      <div>
        {renderTextInSection("View class preferences here")}
        {editsAllowed && renderTextInSection("Edit class preferences")}
      </div>
    );
  }

  function renderClassPrefsEditable() {
    return renderClassPrefs(true);
  }

  function renderClassSchedule(editsAllowed: boolean = false) {
    // tables might not be very accessible
    return (
      <div className="table-container">
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Time</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((scheduleItem, index) => {
              return (
                <tr key={index}>
                  <th>{scheduleItem.timeslot}</th>
                  <td>{scheduleItem.section && scheduleItem.section.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {editsAllowed && renderLinkedText("Edit class schedule", "changeclasses")}
      </div>
    );
  }

  function renderClassScheduleEditable() {
    return renderClassSchedule(true);
  }

  function renderDayOfClassSchedule() {
    return (
      <div>
        {renderTextInSection("View day-of link here")}
        {renderTextInSection("View class schedule here")}
      </div>
    );
  }

  function renderClassView() {
    switch (props.regStatus) {
      case RegStatusOption.ClassPreferences:
        return renderClassPrefsEditable();
      case RegStatusOption.FrozenPreferences:
        return renderClassPrefs();
      case RegStatusOption.ChangeClasses:
        return renderClassScheduleEditable();
      case RegStatusOption.PreProgram:
        return renderClassSchedule();
      case RegStatusOption.DayOf:
        return renderDayOfClassSchedule();
      case RegStatusOption.PostProgram:
        return renderClassSchedule();
      default:
        return renderTextInSection("Something broke :("); // error message
    }
  }

  function renderClassStatus() {
    const canAddClasses =
      props.checks.updateProfileCheck &&
      props.checks.emergencyInfoCheck &&
      props.checks.medliabCheck &&
      props.checks.liabilityCheck &&
      props.checks.availabilityCheck;
    return (
      <div className="column">
        <h2 className="has-text-centered is-size-3 mb-2">Classes</h2>
        {canAddClasses ? (
          renderClassView()
        ) : (
          <h3 className="is-size-5 has-text-centered has-text-danger">
            You need to finish all the tasks assigned to you before you can add classes.
          </h3>
        )}
      </div>
    );
  }

  //TODO block view if studentreg isn't open (or something)
  return (
    <div className="container">
      <h1 className="has-text-centered is-size-2">
        {props.program} {props.edition} Dashboard for {username}
      </h1>
      <br />
      <div className="columns">
        <div className="column">
          <h2 className="has-text-centered is-size-3 mb-2">Register</h2>
          <a href="register">Registration steps</a>
        </div>
        {renderClassStatus()}
      </div>
    </div>
  );
}

export default StudentRegDashboard;
