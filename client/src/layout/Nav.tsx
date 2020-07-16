import React, { useState } from "react";
import "./Nav.css";

import { Link } from "@reach/router";

import { canonicalizeProgramName, programList } from "../info/Program";
import axiosInstance from "../axiosAPI";

import { useAuth, useLoggedIn } from "../context/auth";

type Props = {
  setToken: (token: string) => void;
};

function Nav(props: Props) {
  const { username } = useAuth();
  const loggedIn = useLoggedIn();

  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleMobileMenu() {
    setMobileOpen(!mobileOpen);
  }

  function logout() {
    console.log("Logging out");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    delete axiosInstance.defaults.headers.common["Authorization"];

    props.setToken("");
  }

  function loggedOutView() {
    return (
      <div className="buttons">
        <a className="button is-primary" href="/signup">
          <strong>Sign up</strong>
        </a>
        <a className="button is-light" href="/login">
          Log In
        </a>
      </div>
    );
  }

  function loggedInView() {
    return (
      <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link has-text-weight-bold" href="/dashboard">
          {username}
        </a>

        <div className="navbar-dropdown is-right">
          <a className="navbar-item" href="/dashboard">
            <span className="icon pr-3">
              <i className="fas fa-home"></i>
            </span>
            Dashboard
          </a>
          <a className="navbar-item" href="/profile">
            <span className="icon pr-3">
              <i className="fas fa-user"></i>
            </span>
            Profile
          </a>
          <hr className="navbar-divider"></hr>
          <Link className="navbar-item" to="logout" onClick={logout}>
            Log out
          </Link>
        </div>
      </div>
    );
  }

  return (
    <nav
      className="navbar has-background-success-light"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item has-text-weight-bold" href="/">
            MIT ESP
          </a>

          <button
            type="button"
            className={`button-reset navbar-burger burger ${mobileOpen ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbar"
            onClick={toggleMobileMenu}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div id="navbar" className={`navbar-menu ${mobileOpen ? "is-active" : ""}`}>
          {/* <div className="navbar-start"></div> */}

          <div className="navbar-end">
            <a className="navbar-item has-text-weight-bold" href="/learn">
              Learn
            </a>

            <a className="navbar-item has-text-weight-bold" href="/teach">
              Teach
            </a>

            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link has-text-weight-bold" href="/programs">
                Programs
              </a>

              <div className="navbar-dropdown">
                {programList.map(program => (
                  <a className="navbar-item" key={program} href={`/${program}`}>
                    {canonicalizeProgramName(program)}
                  </a>
                ))}
              </div>
            </div>

            <a className="navbar-item has-text-weight-bold" href="/aboutus">
              About Us
            </a>
          </div>
          <div className="navbar-item">{loggedIn ? loggedInView() : loggedOutView()}</div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
