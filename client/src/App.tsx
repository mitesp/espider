//@ts-nocheck TODO: fix
import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import "./App.sass";

import axiosInstance from "./axiosAPI";
import {
  userDataEndpoint,
  medicalLiabilityEndpoint,
  liabilityWaiverEndpoint,
  studentAvailabilityEndpoint,
} from "./apiEndpoints";

import { AuthContext } from "./context/auth";

import Nav from "./layout/Nav";
import Footer from "./layout/Footer";

import LoginPage from "./accounts/LoginPage";
import SignupPage from "./accounts/SignupPage";

import Home from "./info/Home";

import Dashboard from "./dashboard/Dashboard";

import DummyForm from "./registration/DummyForm";
import EmergencyInfoForm from "./registration/EmergencyInfoForm";
import RegDashboard from "./registration/RegDashboard";
import UpdateProfileForm from "./registration/UpdateProfileForm";
import ChangeClassesDashboard from "./registration/ChangeClassesDashboard";

import AboutUs from "./info/AboutUs";
import Learn from "./info/Learn";
import Nextup from "./info/Nextup";
import Program from "./info/Program";
import Teach from "./info/Teach";
import { programList } from "./info/Program";

const NotFound = () => (
  <section className="pt-5 pb-5 container has-text-centered">
    <p>Invalid URL. Sorry, nothing here!</p>
    <p>
      Return to the <a href="/">homepage</a>.
    </p>
  </section>
);

// TODO: rename, see if we can just get rid of it
type UserState = {
  username: string;
  isStudent: boolean;
  isTeacher: boolean;
};

function App(props: {}) {
  const [userInfo, setUserInfo] = useState({
    username: "",
    isStudent: false,
    isTeacher: false,
  });

  const existingToken = localStorage.getItem("token") || "";
  const [authToken, setAuthToken] = useState(existingToken);

  useEffect(() => {
    if (authToken) {
      axiosInstance.get(userDataEndpoint).then(result => {
        setUserInfo({
          username: result.data.username,
          isStudent: result.data.is_student,
          isTeacher: result.data.is_teacher,
        });
      });
    }
  }, [authToken]);

  function setToken(accessToken: string) {
    setAuthToken(accessToken);
  }

  // TODO (important): refactor login and logout logic out of the UI components
  // where they currently live

  return (
    <AuthContext.Provider value={{ token: authToken, ...userInfo }}>
      <Nav loggedIn={authToken} username={userInfo.username} setToken={setToken} />
      <main className="px-3 py-5">
        <Router>
          <Home path="/" />
          <Home path="logout" />
          <LoginPage path="login" username={userInfo.username} setToken={setToken} />
          <SignupPage path="signup" username={userInfo.username} setToken={setToken} />

          <Dashboard
            path="dashboard"
            loggedIn={authToken}
            username={userInfo.username}
            isStudent={userInfo.isStudent}
            isTeacher={userInfo.isTeacher}
          />
          <AboutUs path="aboutus" />
          <Teach path="teach" />
          <Learn path="learn" />
          <Nextup path="next" />

          {/*TODO figure out how to move these routes elsewhere for better organization*/}

          <RegDashboard
            path="/:program/:edition/dashboard"
            loggedIn={authToken}
            username={userInfo.username}
            isStudent={userInfo.isStudent}
            isTeacher={userInfo.isTeacher}
          />
          <UpdateProfileForm
            path="/:program/:edition/updateprofile"
            isStudent={userInfo.isStudent}
            isTeacher={userInfo.isTeacher}
          />
          <EmergencyInfoForm
            path="/:program/:edition/emergencyinfo"
            isStudent={userInfo.isStudent}
          />
          <DummyForm
            path="/:program/:edition/medliab"
            isStudent={userInfo.isStudent}
            url={medicalLiabilityEndpoint}
            formName="Medical Liabilility Form"
          />
          <DummyForm
            path="/:program/:edition/waiver"
            isStudent={userInfo.isStudent}
            url={liabilityWaiverEndpoint}
            formName="Liability Waiver Form"
          />
          <DummyForm
            path="/:program/:edition/availability"
            isStudent={userInfo.isStudent}
            url={studentAvailabilityEndpoint}
            formName="Program Availability"
          />
          <ChangeClassesDashboard
            path="/:program/:edition/changeclasses"
            loggedIn={authToken}
            username={userInfo.username}
          />
          {programList.map(program => (
            <Program key={program} path={program} program={program} />
          ))}
          <NotFound default />
        </Router>
      </main>
      <Footer />
    </AuthContext.Provider>
  );
}

export { UserState };

export default App;
