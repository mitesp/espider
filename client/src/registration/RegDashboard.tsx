import React, { useEffect, useState } from "react";
import { Router, Redirect } from "@reach/router";
import axiosInstance from "../axiosAPI";

import StudentRegDashboard from "./StudentRegDashboard";
import StudentRegistration from "./StudentRegistration";
import { studentRegEndpoint } from "../apiEndpoints";
import { RegStatusOption } from "./types";

import { useAuth, useLoggedIn } from "../context/auth";

// import TeacherDashboard from "./TeacherRegDashboard";

type Props = {
  program: string;
  edition: string;
};

// TODO: restructure this per-program "dashboard" concept, if anything, this
// component is functioning more like a "ProgramDashboard"

function RegDashboard(props: Props) {
  const { isStudent, isTeacher } = useAuth();
  const loggedIn = useLoggedIn();

  const [regChecks, setRegChecks] = useState({
    availabilityCheck: false,
    emergencyInfoCheck: false,
    liabilityCheck: false,
    medliabCheck: false,
    updateProfileCheck: false,
  });
  const [regStatus, setRegStatus] = useState(RegStatusOption.Empty);

  useEffect(() => {
    // Set up student reg
    axiosInstance.get(`/${props.program}/${props.edition}/${studentRegEndpoint}`).then(res => {
      setRegChecks({
        availabilityCheck: res.data.availability_check,
        emergencyInfoCheck: res.data.emergency_info_check,
        liabilityCheck: res.data.liability_check,
        medliabCheck: res.data.medliab_check,
        updateProfileCheck: res.data.update_profile_check,
      });
      setRegStatus(res.data.reg_status);
    });
  }, [props.edition, props.program]);

  if (loggedIn) {
    return (
      // TODO: create program-specific context and provider to subsequent components
      <div className="container">
        {isStudent && (
          // TODO: overarching application routing organization in one place
          <Router>
            <Redirect from="/" to="dashboard" noThrow />
            <StudentRegDashboard
              /* @ts-ignore TODO: thanks reach router */
              path="dashboard"
              checks={regChecks}
              regStatus={regStatus}
              program={props.program}
              edition={props.edition}
            />
            {/* @ts-ignore TODO: thanks reach router */}
            <StudentRegistration path="register" checks={regChecks} />
          </Router>
        )}

        {isTeacher && true /*<TeacherRegDashboard username={username} />*/}
      </div>
    );
  } else {
    return <div></div>;
    // TODO: login screen, redirect?
  }
}

export default RegDashboard;
