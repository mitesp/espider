import React, { Component } from "react";

import StudentRegDashboard from "./StudentRegDashboard";
// import TeacherDashboard from "./TeacherRegDashboard";

// TODO: Come up with a "login" wall barrier component
type Props = {
  loggedIn: boolean;
  username: string;
  isStudent: boolean;
  isTeacher: boolean;
  program: string;
  edition: string;
};

export default class RegDashboard extends Component<Props, {}> {
  render() {
    const { loggedIn, username, isStudent, isTeacher } = this.props;
    if (loggedIn) {
      return (
        <div className="container">
          {isStudent && (
            <StudentRegDashboard
              loggedIn={loggedIn}
              username={username}
              program={this.props.program}
              edition={this.props.edition}
            />
          )}
          {isTeacher && true /*<TeacherRegDashboard username={username} />*/}
        </div>
      );
    } else {
      return <div></div>;
      // TODO: login screen, redirect?
    }
  }
}
