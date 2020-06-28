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
  regStatus: string;
};

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
    if (this.props.loggedIn) {
      this.getStudentReg();
    }
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

  text(text: string) {
    return <h3 className="is-size-5">{text}</h3>;
  }

  link(text1: string, text2: string, link: string) {
    return (
      <h3 className="is-size-5">
        <a href={link}>{text1}</a>: {text2}
      </h3>
    );
  }

  regStatus() {
    return (
      <div className="column is-4">
        <h2 className="has-text-centered is-size-3">Registration Status</h2>
        {this.state.updateProfileCheck && this.link("Update Profile", "Done", "updateprofile")}
        {this.state.emergencyInfoCheck && this.link("Emergency Info", "Done", "emergencyinfo")}
        {this.state.medliabCheck && this.text("Medical Form: Done")}
        {this.state.liabilityCheck && this.text("Liability Waiver: Done")}
        {this.state.availabilityCheck && this.link("Availability", "Done", "availability")}
      </div>
    );
  }

  tasks() {
    return (
      <div className="column is-4 has-background-success-light">
        <h2 className="has-text-centered is-size-3">Tasks</h2>
        {!this.state.updateProfileCheck && this.link("Update Profile", "Not Done", "updateprofile")}
        {!this.state.emergencyInfoCheck && this.link("Emergency Info", "Not Done", "emergencyinfo")}
        {!this.state.medliabCheck && this.link("Medical Form", "Not Done", "medliab")}
        {!this.state.liabilityCheck && this.link("Liability Waiver", "Not Done", "waiver")}
        {!this.state.availabilityCheck && this.link("Availability", "Done", "availability")}
      </div>
    );
  }

  classPrefs() {
    switch (this.state.regStatus) {
      case "PREF":
        return this.text("Change class preferences here");
      case "FROZ":
        return this.text("View class preferences here");
      case "CH":
        return this.text("Change classes here");
      case "PRE":
        return this.text("View classes here");
      case "DAYOF":
        return this.text("View dayof link here");
      case "POST":
        return this.text("View classes here");
      default:
        return this.text("");
    }
  }

  classStatus() {
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
          this.classPrefs()
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
        <div className="columns">
          {this.regStatus()}
          {this.tasks()}
          {this.classStatus()}
        </div>
      </div>
    );
  }
}

export default StudentRegDashboard;
