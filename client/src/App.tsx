// @ts-nocheck TODO: fix
import React, { Component } from 'react';
import { Router } from "@reach/router";

import "react-bulma-components/dist/react-bulma-components.min.css";

import Nav from "./layout/Nav";
import Footer from "./layout/Footer";

import LoginPage from './signup/LoginPage';
import SignupPage from './signup/SignupPage';

import Home from "./Home";
import Dashboard from "./Dashboard"; //empty placeholder
import StudentDashboard from "./StudentDashboard";

import Program from "./info/Program";
import Teach from "./info/Teach";
import Learn from "./info/Learn";
import AboutUs from "./info/AboutUs";
import { programList } from "./info/Program";

interface UserState {
  logged_in: boolean;
  username: string;
}

class App extends Component<{}, UserState> {

  constructor(props) {
    super(props);
    this.state = {
      logged_in: localStorage.getItem('token') ? true : false,
      username: ''
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('http://localhost:8000/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username });
        });
    }
  }

  login = (data: UserState) => {
    this.setState(data);
    this.componentDidMount();
  }

  logout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  render() {
    return (
      <React.Fragment>
        <Nav logged_in={this.state.logged_in} username={this.state.username} logout = {this.logout}/>
        <main>
          <Router>
            <Home path="/" />
            <StudentDashboard path="studentdashboard" logged_in={this.state.logged_in} username={this.state.username} />
            <Dashboard path="teacherdashboard" />
            <AboutUs path="aboutus" />
            <Teach path="teach" />
            <Learn path="learn" />
            <LoginPage path="login" setState={this.login} logged_in={this.state.logged_in} username={this.state.username} />
            <SignupPage path="signup" setState={this.login} logged_in={this.state.logged_in} username={this.state.username} />
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

export {UserState};

export default App;
