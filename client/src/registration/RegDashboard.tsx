import { Router, Redirect } from "@reach/router";
import React, { useEffect, useState } from "react";

import ChangeClassesDashboard from "./ChangeClassesDashboard";
import StudentRegDashboard from "./StudentRegDashboard";
import StudentRegistration from "./StudentRegistration";
import { RegStatusOption } from "./types";

import { studentRegEndpoint } from "../apiEndpoints";
import axiosInstance from "../axiosAPI";
import { useAuth, useLoggedIn } from "../context/auth";
import { generalPage } from "../layout/Page";

// import TeacherDashboard from "./TeacherRegDashboard";

type Props = {
  program: string;
  season?: string;
  edition: number;
};

// TODO: restructure this per-program "dashboard" concept, if anything, this
// component is functioning more like a "ProgramDashboard"

function getProgramURL(name: string, season: string | undefined, edition: number) {
  if (season) {
    return `${name}/${season}/${edition}`;
  } else {
    return `${name}/${edition}`;
  }
}

function RegDashboard(props: Props) {
  const { isStudent, isTeacher } = useAuth();
  const loggedIn = useLoggedIn();
  const programString =
    (props.season ? `${props.season} ` : "") + `${props.program} ${props.edition}`;
  const programURL = getProgramURL(props.program, props.season, props.edition);

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
    axiosInstance.get(`/${programURL}/${studentRegEndpoint}`).then(res => {
      setRegChecks({
        availabilityCheck: res.data.availability_check,
        emergencyInfoCheck: res.data.emergency_info_check,
        liabilityCheck: res.data.liability_check,
        medliabCheck: res.data.medliab_check,
        updateProfileCheck: res.data.update_profile_check,
      });
      setRegStatus(res.data.reg_status);
    });
  }, [programURL]);

  if (loggedIn) {
    return generalPage(`${programString} | MIT ESP`)(
      // TODO: create program-specific context and provider to subsequent components
      <React.Fragment>
        {isStudent && (
          // TODO: overarching application routing organization in one place
          <Router primary={false}>
            <Redirect from="/" to="dashboard" noThrow />
            <StudentRegDashboard
              /* @ts-ignore TODO: reach-router path fix */
              path="dashboard"
              checks={regChecks}
              regStatus={regStatus}
              programString={programString}
              programURL={programURL}
            />
            {/* @ts-ignore TODO: figure out what the complaint about StudentRegistration is */}
            <StudentRegistration
              // @ts-ignore TODO: reach-router path fix
              path="register"
              checks={regChecks}
              programString={programString}
              programURL={programURL}
            />
            <ChangeClassesDashboard
              // @ts-ignore TODO: reach-router path fix
              path="changeclasses"
              programString={programString}
              programURL={programURL}
            />
          </Router>
        )}

        {isTeacher && true /*<TeacherRegDashboard username={username} />*/}
      </React.Fragment>
    );
  } else {
    return <div></div>;
    // TODO: login screen, redirect?
  }
}

export default RegDashboard;
