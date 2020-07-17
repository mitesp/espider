// @ts-nocheck TODO: fix\
import React, { Component } from "react";
import { Router } from "@reach/router";
import "./App.sass";

import Home from "./Home";
import LoginPage from "./accounts/LoginPage";

class App extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  login = (data: UserState) => {
    this.setState(data);
  };

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  render() {
    return (
      <React.Fragment>
        <main className="px-3 py-5">
          <Router>
            <Home path="/" />
            <LoginPage path="login" />
          </Router>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
