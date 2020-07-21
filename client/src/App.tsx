// @ts-nocheck TODO: fix
import "./App.sass";

import { Router } from "@reach/router";
import React, { useEffect, useState } from "react";

import LoginPage from "./accounts/LoginPage";
import SignupPage from "./accounts/SignupPage";
import { userDataEndpoint } from "./apiEndpoints";
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
import PrivateRoute from "./PrivateRoute";
import { contentPage } from "./layout/Page";
import RegDashboard from "./registration/RegDashboard";

const NotFound = () =>
  contentPage("404 Not found")(
    <section className="pt-5 pb-5 container has-text-centered">
      <p>Invalid URL. Sorry, nothing here!</p>
      <p>
        Return to the <a href="/">homepage</a>.
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

  function setToken(accessToken: string) {
    setAuthToken(accessToken);
  }

  return (
    <AuthContext.Provider value={{ token: authToken, ...userInfo }}>
      <Nav setToken={setToken} />
      <main className="px-3 py-5">
        <Router>
          <Home path="/" />
          {/* TODO: better page than homepage? Notification of logout success? */}
          <Home path="logout" />
          <PrivateRoute path="nextup" as={Nextup} />
          <LoginPage path="login" setToken={setToken} />
          <SignupPage path="signup" setToken={setToken} />

          <Dashboard path="dashboard" />
          <AboutUs path="aboutus" />
          <Teach path="teach" />
          <Learn path="learn" />
          <Nextup path="next" />

          {programList.map(program => (
            <Program key={program} path={program} program={program} />
          ))}

          <RegDashboard path=":program/:edition/*" />

          <NotFound default />
        </Router>
      </main>
      <Footer />
    </AuthContext.Provider>
  );
}

export default App;
