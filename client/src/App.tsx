// @ts-nocheck TODO: fix
import React from "react";
import { Router } from "@reach/router";

import "react-bulma-components/dist/react-bulma-components.min.css";

import Nav from "./layout/Nav";
import Footer from "./layout/Footer";

import Home from "./Home";
import Dashboard from "./Dashboard";

import Program from "./info/Program";
import Teach from "./info/Teach";
import Learn from "./info/Learn";
import AboutUs from "./info/AboutUs";
import { programList } from "./info/Program";

function App() {
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
          {programList.map((program) => (
            <Program key={program} path={program} program={program} />
          ))}
        </Router>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default App;
