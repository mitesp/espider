// @ts-nocheck TODO: fix
import React, { Component } from 'react';
import { Router } from "@reach/router";

import "react-bulma-components/dist/react-bulma-components.min.css";

import Nav from "./layout/Nav";
import Footer from "./layout/Footer";

import LoginPage from './signup/LoginPage';

import Home from "./Home";
import Dashboard from "./Dashboard";

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

  login = (e: React.FormEvent<HTMLFormElement>, data: UserState) => {
    this.setState(data);
  }

  render() {
    return (
      <React.Fragment>
        <Nav />
        <main>
          <Router>
            <Home path="/" />
            <Dashboard path="dashboard" />
            <AboutUs path="aboutus" />
            <Teach path="teach" />
            <Learn path="learn" />
            <LoginPage path="login" setState={this.login} logged_in={() => this.state.logged_in} username={() => this.state.username} />
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
