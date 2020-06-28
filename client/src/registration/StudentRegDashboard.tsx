import React, { Component } from "react";
import axiosInstance from "../axiosAPI";

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
  regStatus: string; // TODO(mvadari): we probably want an enum here -- ideally connected to the
  // backend
};

// helper functions

function text(text: string) {
  return <h3 className="is-size-5">{text}</h3>;
}

function link(text1: string, text2: string, link: string) {
  return (
    <h3 className="is-size-5">
      <a href={link}>{text1}</a>: {text2}
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
      regStatus: "",
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

  textInSection(text: string) {
    return <h3 className="is-size-5">{text}</h3>;
  }

  taskNoLink(taskName: string, taskCompleted: boolean) {
    return (
      <h3 className="is-size-5">
        {taskName}: {taskCompleted ? "Done" : "Not Done"}
      </h3>
    );
  }

  taskWithLink(taskName: string, taskCompleted: boolean, link: string) {
    return (
      <h3 className="is-size-5">
        <a href={link}>{taskName}</a>: {taskCompleted ? "Done" : "Not Done"}
      </h3>
    );
  }

  renderRegStatus() {
    return (
      <div className="column is-4">
        <h2 className="has-text-centered is-size-3">Registration Status</h2>
        {this.state.updateProfileCheck &&
          this.taskWithLink("Update Profile", true, "updateprofile")}
        {this.state.emergencyInfoCheck &&
          this.taskWithLink("Emergency Info", true, "emergencyinfo")}
        {this.state.medliabCheck && this.taskNoLink("Medical Form", true)}
        {this.state.liabilityCheck && this.taskNoLink("Liability Waiver", true)}
        {this.state.availabilityCheck && this.taskWithLink("Availability", true, "availability")}
      </div>
    );
  }

  renderTasks() {
    return (
      <div className="column is-4 has-background-success-light">
        <h2 className="has-text-centered is-size-3">Tasks</h2>
        {!this.state.updateProfileCheck &&
          this.taskWithLink("Update Profile", false, "updateprofile")}
        {!this.state.emergencyInfoCheck &&
          this.taskWithLink("Emergency Info", false, "emergencyinfo")}
        {!this.state.medliabCheck && this.taskWithLink("Medical Form", false, "medliab")}
        {!this.state.liabilityCheck && this.taskWithLink("Liability Waiver", false, "waiver")}
        {!this.state.availabilityCheck && this.taskWithLink("Availability", false, "availability")}
      </div>
    );
  }

  renderClassPrefs() {
    switch (this.state.regStatus) {
      case "PREF":
        return this.textInSection("Change class preferences here");
      case "FROZ":
        return this.textInSection("View class preferences here");
      case "CH":
        return this.textInSection("Change classes here");
      case "PRE":
        return this.textInSection("View classes here");
      case "DAYOF":
        return this.textInSection("View dayof link here");
      case "POST":
        return this.textInSection("View classes here");
      default:
        return this.textInSection("");
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
