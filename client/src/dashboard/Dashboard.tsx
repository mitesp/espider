import React, { Component } from "react";

import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";

// TODO: Come up with a "login" wall barrier component
type Props = {
  loggedIn: boolean;
  username: string;
  isStudent: boolean;
  isTeacher: boolean;
};

export default class Dashboard extends Component<Props, {}> {
  render() {
    const { loggedIn, username, isStudent, isTeacher } = this.props;
    if (loggedIn) {
      return (
        <div className="container">
          {isStudent && <StudentDashboard username={username} />}
          {isTeacher && <TeacherDashboard username={username} />}
        </div>
      );
    } else {
      return <div></div>;
      // TODO: login screen, redirect?
    }
  }
}
