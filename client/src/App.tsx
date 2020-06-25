// @ts-nocheck TODO: fix\
import React, { Component } from "react";
import { Router } from "@reach/router";
import "./App.sass";

import axiosInstance from "./axiosAPI";

import Nav from "./layout/Nav";
import Footer from "./layout/Footer";

import LoginPage from "./login/LoginPage";
import SignupPage from "./login/SignupPage";

import Home from "./info/Home";
import StudentDashboard from "./dashboard/StudentDashboard";
import TeacherDashboard from "./dashboard/TeacherDashboard";

import Program from "./info/Program";
import Teach from "./info/Teach";
import Learn from "./info/Learn";
import Nextup from "./info/Nextup";
import AboutUs from "./info/AboutUs";
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
    if (this.state.loggedIn) {
      axiosInstance.get("/current_user/").then((result) => {
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
    this.componentDidMount();
  };

  logout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    delete axiosInstance.defaults.headers.common["Authorization"];
    this.setState({ loggedIn: false, username: "" });
  };

  render() {
    return (
      <React.Fragment>
        <Nav
          loggedIn={this.state.loggedIn}
          username={this.state.username}
          logout={this.logout}
        />
        <main>
          <Router>
            <Home path="/" />
            <StudentDashboard
              path="studentdashboard"
              loggedIn={this.state.loggedIn}
              username={this.state.username}
              isStudent={this.state.isStudent}
            />
            <TeacherDashboard
              path="teacherdashboard"
              loggedIn={this.state.loggedIn}
              username={this.state.username}
              isTeacher={this.state.isTeacher}
            />
            <AboutUs path="aboutus" />
            <Teach path="teach" />
            <Learn path="learn" />
            <Nextup path="next" />
            <LoginPage
              path="login"
              setState={this.login}
              loggedIn={this.state.loggedIn}
              username={this.state.username}
            />
            <SignupPage
              path="signup"
              setState={this.login}
              loggedIn={this.state.loggedIn}
              username={this.state.username}
            />
            {programList.map((program) => (
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
