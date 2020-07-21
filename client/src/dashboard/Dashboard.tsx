import React from "react";

import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";

import { useAuth, useLoggedIn } from "../context/auth";

function Dashboard(props: {}) {
  document.title = "Dashboard | MIT ESP";

  const { username, isStudent, isTeacher } = useAuth();
  const loggedIn = useLoggedIn();

  if (loggedIn) {
    return (
      <div className="container">
        {isStudent && <StudentDashboard username={username} />}
        {isTeacher && <TeacherDashboard username={username} />}
      </div>
    );
  } else {
    // TODO: login screen, redirect?
    return <div></div>;
  }
}

export default Dashboard;
