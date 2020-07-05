// @ts-nocheck TODO: fix\
import React, { Component } from "react";
import { Router } from "@reach/router";
import "./App.sass";

import axiosInstance from "./axiosAPI";
import {
  userDataEndpoint,
  medicalLiabilityEndpoint,
  liabilityWaiverEndpoint,
  studentAvailabilityEndpoint,
} from "./apiEndpoints";

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

type UserState = {
  loggedIn: boolean;
  username: string;
  isStudent: boolean;
  isTeacher: boolean;
};

type State = UserState;

class App extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: localStorage.getItem("token") ? true : false,
      username: "",
      isStudent: false,
      isTeacher: false,
    };
  }

  componentDidMount() {
    console.log(process.env.baseURL);
    console.log(process.env);
    console.log(process.env.DATABASE_URL);
    if (this.state.loggedIn) {
      axiosInstance.get(userDataEndpoint).then(result => {
        this.setState({
          username: result.data.username,
          isStudent: result.data.is_student,
          isTeacher: result.data.is_teacher,
        });
      });
    }
  }

  login = (data: UserState) => {
    this.setState(data);
    //TODO: manually calling component did mount?
    this.componentDidMount();
  };

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    delete axiosInstance.defaults.headers.common["Authorization"];
    this.setState({ loggedIn: false, username: "", isStudent: false, isTeacher: false });
  };

  render() {
    return (
      <React.Fragment>
        <Nav loggedIn={this.state.loggedIn} username={this.state.username} logout={this.logout} />
        <main className="px-3 py-5">
          <Router>
            <Home path="/" />
            {/* TODO: This is terrible, actually do it correctly, without the onClick on the log out link. */}
            <Home path="/logout" />
            <Dashboard
              path="dashboard"
              loggedIn={this.state.loggedIn}
              username={this.state.username}
              isStudent={this.state.isStudent}
              isTeacher={this.state.isTeacher}
            />
            <AboutUs path="aboutus" />
            <Teach path="teach" />
            <Learn path="learn" />
            <Nextup path="next" />
            <LoginPage
              path="login"
              onLogin={this.login}
              loggedIn={this.state.loggedIn}
              username={this.state.username}
            />
            <SignupPage
              path="signup"
              onLogin={this.login}
              loggedIn={this.state.loggedIn}
              username={this.state.username}
            />

            {/*TODO figure out how to move these routes elsewhere for better organization*/}

            <RegDashboard
              path="/:program/:edition/dashboard"
              loggedIn={this.state.loggedIn}
              username={this.state.username}
              isStudent={this.state.isStudent}
              isTeacher={this.state.isTeacher}
            />
            <UpdateProfileForm
              path="/:program/:edition/updateprofile"
              isStudent={this.state.isStudent}
              isTeacher={this.state.isTeacher}
            />
            <EmergencyInfoForm
              path="/:program/:edition/emergencyinfo"
              isStudent={this.state.isStudent}
            />
            <DummyForm
              path="/:program/:edition/medliab"
              isStudent={this.state.isStudent}
              url={medicalLiabilityEndpoint}
              formName="Medical Liabilility Form"
            />
            <DummyForm
              path="/:program/:edition/waiver"
              isStudent={this.state.isStudent}
              url={liabilityWaiverEndpoint}
              formName="Liability Waiver Form"
            />
            <DummyForm
              path="/:program/:edition/availability"
              isStudent={this.state.isStudent}
              url={studentAvailabilityEndpoint}
              formName="Program Availability"
            />
            <ChangeClassesDashboard
              path="/:program/:edition/changeclasses"
              loggedIn={this.state.loggedIn}
              username={this.state.username}
            />
            {programList.map(program => (
              <Program key={program} path={program} program={program} />
            ))}
            <NotFound default />
          </Router>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

export { UserState };

export default App;
