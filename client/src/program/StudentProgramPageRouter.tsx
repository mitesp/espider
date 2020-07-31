import { Router } from "@reach/router";
import React, { useEffect, useState } from "react";

import StudentProgramInfoPage from "./StudentProgramInfoPage";
// import { isStudentRegistered } from "./helpers";

import { studentRegEndpoint } from "../apiEndpoints";
import axiosInstance from "../axiosAPI";
import { useLoggedIn } from "../context/auth";
import ChangeClassesDashboard from "../registration/ChangeClassesDashboard";
import StudentRegistration from "../registration/StudentRegistration";
import { RegStatusOption } from "../registration/types";

type Props = {
  program: string;
  edition: string;
};

function StudentProgramPageRouter(props: Props) {
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
    if (loggedIn) {
      console.log(`/${props.program}/${props.edition}/${studentRegEndpoint}`);
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
    }
  }, [loggedIn, props.edition, props.program]);

  return (
    <React.Fragment>
      <Router primary={false}>
        <StudentProgramInfoPage
          /* @ts-ignore TODO: thanks reach router */
          path="/"
          checks={regChecks}
          regStatus={regStatus}
          program={props.program}
          edition={props.edition}
        />
        {/* @ts-ignore TODO: thanks reach router */}
        <StudentRegistration path="register" checks={regChecks} />
        {/* @ts-ignore TODO: thanks reach router */}
        <ChangeClassesDashboard path="changeclasses" />
      </Router>
    </React.Fragment>
  );
}

export default StudentProgramPageRouter;
