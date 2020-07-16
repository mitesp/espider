// @ts-nocheck TODO: fix\
import React, { Component } from "react";
import { Router } from "@reach/router";
import "./App.sass";

import Nav from "./layout/Nav";

import Home from "./Home";
import LoginPage from "./accounts/LoginPage";

const NotFound = () => (
  <section className="pt-5 pb-5 container has-text-centered">
    <p>Invalid URL. Sorry, nothing here!</p>
    <p>
      Return to the <a href="/">homepage</a>.
    </p>
  </section>
);

export type UserState = {
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

  componentDidMount() {}

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
            <LoginPage
              path="login"
              onLogin={this.login}
              loggedIn={this.state.loggedIn}
              username={this.state.username}
            />
            {/* TODO: This is terrible, actually do it correctly, without the onClick on the log out link. */}
            <NotFound default />
          </Router>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
