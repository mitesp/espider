import React, { Component } from "react";
import axiosInstance from "../axiosAPI";

type JSONProgram = {
  name: string;
  edition: string;
};

type Program = {
  name: string;
  url: string;
};

type Props = {
  loggedIn: boolean;
  username: string;
  program: string;
  edition: string;
};

type State = {
  availability_check: boolean;
  emergency_info_check: boolean;
  liability_check: boolean;
  medliab_check: boolean;
  update_profile_check: boolean;
  reg_status: string;
};

class StudentRegDashboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      availability_check: false,
      emergency_info_check: false,
      liability_check: false,
      medliab_check: false,
      update_profile_check: false,
      reg_status: "",
    };
  }

  componentDidMount() {
    if (this.props.loggedIn) {
      this.getStudentReg();
    }
  }

  digestStudentReg() {
    return {};
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
            availability_check: res.data.availability_check,
            emergency_info_check: res.data.emergency_info_check,
            liability_check: res.data.liability_check,
            medliab_check: res.data.medliab_check,
            update_profile_check: res.data.update_profile_check,
            reg_status: res.data.reg_status,
          });
        });
    }
  }

  text(text: String) {
    return <h3 className="is-size-5">{text}</h3>;
  }

  regStatus() {
    return (
      <div className="column is-4">
        <h2 className="has-text-centered is-size-3">Registration Status</h2>
        {this.state.update_profile_check && this.text("Update Profile: Done")}
        {this.state.emergency_info_check && this.text("Emergency Info: Done")}
        {this.state.medliab_check && this.text("Medical Form: Done")}
        {this.state.liability_check && this.text("Liability Waiver: Done")}
        {this.state.availability_check && this.text("Availability: Done")}
      </div>
    );
  }

  tasks() {
    return (
      <div className="column is-4 has-background-primary">
        <h2 className="has-text-centered is-size-3">Tasks</h2>
        {!this.state.update_profile_check && this.text("Update Profile: Not Done")}
        {!this.state.emergency_info_check && this.text("Emergency Info: Not Done")}
        {!this.state.medliab_check && this.text("Medical Form: Not Done")}
        {!this.state.liability_check && this.text("Liability Waiver: Not Done")}
        {!this.state.availability_check && this.text("Availability: Not Done")}
      </div>
    );
  }

  classPrefs() {
    return this.text("Add classes here");
  }

  classStatus() {
    const canAddClasses =
      this.state.update_profile_check &&
      this.state.emergency_info_check &&
      this.state.medliab_check &&
      this.state.liability_check &&
      this.state.availability_check;
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
      <section className="pt-5 pb-5">
        <div className="container content">
          <h1 className="has-text-centered is-size-2">
            {this.props.program} {this.props.edition} Dashboard for {this.props.username}
          </h1>
          <div className="columns">
            {this.regStatus()}
            {this.tasks()}
            {this.classStatus()}
          </div>
        </div>
      </section>
    );
  }
}

export default StudentRegDashboard;
