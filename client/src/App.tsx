import "./App.sass";

import { Router, Link } from "@reach/router";
import React, { useEffect, useState } from "react";

import LoginPage from "./accounts/LoginPage";
import SignupPage from "./accounts/SignupPage";
import { userDataEndpoint, programsEndpoint } from "./apiEndpoints";
import axiosInstance from "./axiosAPI";
import { AuthContext } from "./context/auth";
import Dashboard from "./dashboard/Dashboard";
import AboutUs from "./info/AboutUs";
import Home from "./info/Home";
import Learn from "./info/Learn";
import Nextup from "./info/Nextup";
import Program, { programList } from "./info/Program";
import Teach from "./info/Teach";
import Footer from "./layout/Footer";
import Nav from "./layout/Nav";
import { contentPage } from "./layout/Page";
import PrivateRoute from "./PrivateRoute";
import ProgramPage from "./program/ProgramPage";
import RegDashboard from "./registration/RegDashboard";
import { ProgramModel } from "./types";

const NotFound = () =>
  contentPage("404 Not found")(
    <section className="pt-5 pb-5 container has-text-centered">
      <p>Invalid URL. Sorry, nothing here!</p>
      <p>
        Return to the <Link to="/">homepage</Link>.
      </p>
    </section>
  );

function App(props: {}) {
  const [userInfo, setUserInfo] = useState({
    username: "",
    isStudent: false,
    isTeacher: false,
  });

  const existingToken = localStorage.getItem("token") || "";
  const [authToken, setAuthToken] = useState(existingToken);
  const [programs, setPrograms] = useState([] as ProgramModel[]);

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
  }, [authToken, props]);

  useEffect(() => {
    axiosInstance.get(programsEndpoint).then(result => {
      setPrograms(result.data);
    });
  }, []);

  function setToken(accessToken: string) {
    setAuthToken(accessToken);
  }

  return (
    <AuthContext.Provider value={{ token: authToken, ...userInfo }}>
      <Nav setToken={setToken} />
      <main className="px-3 py-5">
        {/* NOTE: primary=false causes the scroll position on the new "page" to be the top of the page instead of the top of the component. */}
        <Router primary={false}>
          {/* @ts-ignore TODO: reach-router path fix */}
          <Home path="/" />
          {/* TODO: better page than homepage? Notification of logout success? */}
          {/* @ts-ignore TODO: reach-router path fix */}
          <Home path="logout" />
          <PrivateRoute path="nextup" as={Nextup} />
          {/* @ts-ignore TODO: reach-router path fix */}
          <LoginPage path="login" setToken={setToken} />
          {/* @ts-ignore TODO: reach-router path fix */}
          <SignupPage path="signup" setToken={setToken} />

          {/* @ts-ignore TODO: reach-router path fix */}
          <Dashboard path="dashboard" />
          {/* @ts-ignore TODO: reach-router path fix */}
          <AboutUs path="aboutus" />
          {/* @ts-ignore TODO: reach-router path fix */}
          <Teach path="teach" />
          {/* @ts-ignore TODO: reach-router path fix */}
          <Learn path="learn" />
          {/* @ts-ignore TODO: reach-router path fix */}
          <Nextup path="next" />

          {programList.map(program => (
            //  @ts-ignore TODO: reach-router path fix
            <Program key={program} path={program} program={program} />
          ))}

          {programs.map((program, index) => (
            <RegDashboard
              key={index}
              // @ts-ignore TODO: reach-router path fix
              path={`${program.name}/${program.edition}/*`}
              program={program.name}
              edition={program.edition}
            />
            // TODO do something about the half-second it takes to render the page (maybe just caching)
          ))}
          {/* @ts-ignore TODO: reach-router path fix */}
          <ProgramPage path="beta/:program/:edition/*" />
          {/* @ts-ignore TODO: reach-router path fix */}
          <NotFound default />
        </Router>
      </main>
      <Footer />
    </AuthContext.Provider>
  );
}

export default App;
