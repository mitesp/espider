import React, { Component } from "react";
import axiosInstance from "../axiosAPI";
import { RegStatusOption } from "./types";

type Props = {
  loggedIn: boolean;
  username: string;
  program: string;
  edition: string;
};

type State = {
  availabilityCheck: boolean;
  emergencyInfoCheck: boolean;
  liabilityCheck: boolean;
  medliabCheck: boolean;
  updateProfileCheck: boolean;
  regStatus: RegStatusOption;
};

// helper functions


function renderTextInSection(text: string) {
  return <h3 className="is-size-5">{text}</h3>;
}

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

class StudentRegDashboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      availabilityCheck: false,
      emergencyInfoCheck: false,
      liabilityCheck: false,
      medliabCheck: false,
      updateProfileCheck: false,
      regStatus: RegStatusOption.Empty, // idk if this is the best solution
    };
  }

  componentDidMount() {
    this.getStudentReg();
  }

  getStudentReg() {
    if (this.props.loggedIn) {
      axiosInstance
        .get("/current_studentreg/", {
          params: {
            program: this.props.program,
            edition: this.props.edition,
          },
        })
        .then(res => {
          this.setState({
            availabilityCheck: res.data.availability_check,
            emergencyInfoCheck: res.data.emergency_info_check,
            liabilityCheck: res.data.liability_check,
            medliabCheck: res.data.medliab_check,
            updateProfileCheck: res.data.update_profile_check,
            regStatus: res.data.reg_status,
          });
        });
    }
  }

  renderRegStatus() {
    return (
      <div className="column is-4">
        <h2 className="has-text-centered is-size-3">Registration Status</h2>
        {this.state.updateProfileCheck && renderTaskLink("Update Profile", true, "updateprofile")}
        {this.state.emergencyInfoCheck && renderTaskLink("Emergency Info", true, "emergencyinfo")}
        {this.state.medliabCheck && renderTaskNoLink("Medical Form", true)}
        {this.state.liabilityCheck && renderTaskNoLink("Liability Waiver", true)}
        {this.state.availabilityCheck && renderTaskLink("Availability", true, "availability")}
      </div>
    );
  }

  renderTasks() {
    return (
      <div className="column is-4 has-background-success-light">
        <h2 className="has-text-centered is-size-3">Tasks</h2>
        {!this.state.updateProfileCheck && renderTaskLink("Update Profile", false, "updateprofile")}
        {!this.state.emergencyInfoCheck && renderTaskLink("Emergency Info", false, "emergencyinfo")}
        {!this.state.medliabCheck && renderTaskLink("Medical Form", false, "medliab")}
        {!this.state.liabilityCheck && renderTaskLink("Liability Waiver", false, "waiver")}
        {!this.state.availabilityCheck && renderTaskLink("Availability", false, "availability")}
      </div>
    );
  }

  renderClassPrefs() {
    switch (this.state.regStatus) {
      case RegStatusOption.ClassPreferences:
        return renderTextInSection("Change class preferences here");
      case RegStatusOption.FrozenPreferences:
        return renderTextInSection("View class preferences here");
      case RegStatusOption.ChangeClasses:
        return renderTextInSection("Change classes here");
      case RegStatusOption.PreProgram:
        return renderTextInSection("View classes here");
      case RegStatusOption.DayOf:
        return renderTextInSection("View dayof link here");
      case RegStatusOption.PostProgram:
        return renderTextInSection("View classes here");
      default:
        return renderTextInSection("Something broke :("); // error message
    }
  }

  renderClassStatus() {
    const canAddClasses =
      this.state.updateProfileCheck &&
      this.state.emergencyInfoCheck &&
      this.state.medliabCheck &&
      this.state.liabilityCheck &&
      this.state.availabilityCheck;
    return (
      <div className="column is-4">
        <h2 className="has-text-centered is-size-3">Class Status</h2>
        {canAddClasses ? (
          this.renderClassPrefs()
        ) : (
          <h3 className="is-size-5 has-text-centered has-text-danger">
            You need to finish all the tasks assigned to you before you can add classes.
          </h3>
        )}
      </div>
    );
  }

  render() {
    //TODO block view if studentreg isn't open (or something)
    return (
      <div className="container">
        <h1 className="has-text-centered is-size-2">
          {this.props.program} {this.props.edition} Dashboard for {this.props.username}
        </h1>
        <br />
        <div className="columns">
          {this.renderRegStatus()}
          {this.renderTasks()}
          {this.renderClassStatus()}
        </div>
      </div>
    );
  }
}

export default StudentRegDashboard;
