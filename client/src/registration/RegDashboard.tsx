import React from "react";

import StudentRegDashboard from "./StudentRegDashboard";

import { useAuth, useLoggedIn } from "../context/auth";

// import TeacherDashboard from "./TeacherRegDashboard";

type Props = {
  program: string;
  edition: string;
};

function RegDashboard(props: Props) {
  const { isStudent, isTeacher } = useAuth();
  const loggedIn = useLoggedIn();

  if (loggedIn) {
    return (
      <div className="container">
        {isStudent && <StudentRegDashboard program={props.program} edition={props.edition} />}
        {isTeacher && true /*<TeacherRegDashboard username={username} />*/}
      </div>
    );
  } else {
    return <div></div>;
    // TODO: login screen, redirect?
  }
}

export default RegDashboard;
