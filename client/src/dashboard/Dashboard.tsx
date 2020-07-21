import React from "react";

import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";

import { useAuth, useLoggedIn } from "../context/auth";
import { generalPage } from "../layout/Page";

function Dashboard(props: {}) {
  document.title = "Dashboard | MIT ESP";

  const { username, isStudent, isTeacher } = useAuth();
  const loggedIn = useLoggedIn();

  if (loggedIn) {
    return generalPage("Login | MIT ESP")(
      <React.Fragment>
        {isStudent && <StudentDashboard username={username} />}
        {isTeacher && <TeacherDashboard username={username} />}
      </React.Fragment>
    );
  } else {
    // TODO: login screen, redirect?
    return <div></div>;
  }
}

export default Dashboard;
