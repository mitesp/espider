import { Link } from "@reach/router";
import React, { useEffect, useState } from "react";

import { studentScheduleEndpoint } from "../apiEndpoints";
import axiosInstance from "../axiosAPI";
import { renderLinkedText, renderTextInSection } from "../helperTextFunctions";
import { generalPage } from "../layout/Page";
import { RegStatusOption, ScheduleItem } from "../registration/types";

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

function StudentProgramInfoPage(props: Props) {
  const [schedule, setSchedule] = useState([] as ScheduleItem[]);

  function renderRegistrationLink() {
    return <Link to="register">Registration steps</Link>;
  }

  useEffect(() => {
    // Set up student classes
    axiosInstance.get(`/${props.program}/${props.edition}/${studentScheduleEndpoint}`).then(res => {
      setSchedule(res.data);
    });
  }, [props.edition, props.program]);

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
  return generalPage(`${props.program} ${props.edition} | MIT ESP`)(
    <div className="columns">
      <div className="column">
        <p>Some information can go here!</p>
        {renderRegistrationLink()}
      </div>
      <div className="column">{renderClassStatus()}</div>
    </div>
  );
}

export default StudentProgramInfoPage;
