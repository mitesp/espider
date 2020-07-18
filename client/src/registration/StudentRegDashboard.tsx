import React, { useEffect, useState } from "react";

import { RegStatusOption, ScheduleItem } from "./types";

import { studentRegEndpoint, studentScheduleEndpoint } from "../apiEndpoints";
import axiosInstance from "../axiosAPI";
import { useAuth } from "../context/auth";
import { renderLinkedText, renderTextInSection } from "../helperTextFunctions";

type Props = {
  program: string;
  edition: string;
};

// helper functions

function renderTaskNoLink(taskName: string, taskCompleted: boolean) {
  return (
    <h3 className="is-size-5">
      {taskName}: {taskCompleted ? "Done" : "Not Done"}
    </h3>
  );
}

function renderTaskLink(taskName: string, taskCompleted: boolean, link: string) {
  return (
    <h3 className="is-size-5">
      <a href={link}>{taskName}</a>: {taskCompleted ? "Done" : "Not Done"}
    </h3>
  );
}

function StudentRegDashboard(props: Props) {
  const { username } = useAuth();

  const [regState, setRegState] = useState({
    availabilityCheck: false,
    emergencyInfoCheck: false,
    liabilityCheck: false,
    medliabCheck: false,
    updateProfileCheck: false,
    regStatus: RegStatusOption.Empty, // idk if this is the best solution
  });

  const [schedule, setSchedule] = useState([] as ScheduleItem[]);

  useEffect(() => {
    // Set up student reg
    axiosInstance.get(`/${props.program}/${props.edition}/${studentRegEndpoint}`).then(res => {
      setRegState({
        availabilityCheck: res.data.availability_check,
        emergencyInfoCheck: res.data.emergency_info_check,
        liabilityCheck: res.data.liability_check,
        medliabCheck: res.data.medliab_check,
        updateProfileCheck: res.data.update_profile_check,
        regStatus: res.data.reg_status,
      });
    });
    // Set up student classes
    axiosInstance.get(`/${props.program}/${props.edition}/${studentScheduleEndpoint}`).then(res => {
      setSchedule(res.data);
    });
  }, [props.edition, props.program]);

  function renderRegStatus() {
    return (
      <div className="column is-3">
        <h2 className="has-text-centered is-size-3 mb-2">Registration Status</h2>
        {regState.updateProfileCheck && renderTaskLink("Update Profile", true, "updateprofile")}
        {regState.emergencyInfoCheck && renderTaskLink("Emergency Info", true, "emergencyinfo")}
        {regState.medliabCheck && renderTaskNoLink("Medical Form", true)}
        {regState.liabilityCheck && renderTaskNoLink("Liability Waiver", true)}
        {regState.availabilityCheck && renderTaskLink("Availability", true, "availability")}
      </div>
    );
  }

  function renderTasks() {
    return (
      <div className="column is-3 has-background-success-light">
        <h2 className="has-text-centered is-size-3 mb-2">Tasks</h2>
        {!regState.updateProfileCheck && renderTaskLink("Update Profile", false, "updateprofile")}
        {!regState.emergencyInfoCheck && renderTaskLink("Emergency Info", false, "emergencyinfo")}
        {!regState.medliabCheck && renderTaskLink("Medical Form", false, "medliab")}
        {!regState.liabilityCheck && renderTaskLink("Liability Waiver", false, "waiver")}
        {!regState.availabilityCheck && renderTaskLink("Availability", false, "availability")}
      </div>
    );
  }

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
    switch (regState.regStatus) {
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
      regState.updateProfileCheck &&
      regState.emergencyInfoCheck &&
      regState.medliabCheck &&
      regState.liabilityCheck &&
      regState.availabilityCheck;
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
        {renderRegStatus()}
        {renderTasks()}
        {renderClassStatus()}
      </div>
    </div>
  );
}

export default StudentRegDashboard;
