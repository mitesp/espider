// @ts-nocheck TODO: fix
import React, { Component } from "react";
import { Router } from "@reach/router";

import Nav from "./layout/Nav";
import Footer from "./layout/Footer";

import LoginPage from "./signup/LoginPage";
import SignupPage from "./signup/SignupPage";

import Home from "./Home";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";

import Program from "./info/Program";
import Teach from "./info/Teach";
import Learn from "./info/Learn";
import Nextup from "./info/Nextup";
import AboutUs from "./info/AboutUs";
import { programList } from "./info/Program";

interface UserState {
  logged_in: boolean;
  username: string;
  is_student: boolean;
  is_teacher: boolean;
}

class App extends Component<{}, UserState> {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: localStorage.getItem("token") ? true : false,
      username: "",
      is_student: false,
      is_teacher: false,
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch("http://localhost:8000/current_user/", {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            username: json.username,
            is_student: json.is_student,
            is_teacher: json.is_teacher,
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
    this.setState({ logged_in: false, username: "" });
  };

  render() {
    return (
      <React.Fragment>
        <Nav
          logged_in={this.state.logged_in}
          username={this.state.username}
          logout={this.logout}
        />
        <main>
          <Router>
            <Home path="/" />
            <StudentDashboard
              path="studentdashboard"
              logged_in={this.state.logged_in}
              username={this.state.username}
              is_student={this.state.is_student}
            />
            <TeacherDashboard
              path="teacherdashboard"
              logged_in={this.state.logged_in}
              username={this.state.username}
              is_teacher={this.state.is_teacher}
            />
            <AboutUs path="aboutus" />
            <Teach path="teach" />
            <Learn path="learn" />
            <Nextup path="next" />
            <LoginPage
              path="login"
              setState={this.login}
              logged_in={this.state.logged_in}
              username={this.state.username}
            />
            <SignupPage
              path="signup"
              setState={this.login}
              logged_in={this.state.logged_in}
              username={this.state.username}
            />
            {programList.map((program) => (
              <Program key={program} path={program} program={program} />
            ))}
          </Router>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

export { UserState };

export default App;
