import { Link } from "@reach/router";
import React, { useState } from "react";
import "./Nav.css";

import { logout } from "../accounts/manage";
import { useAuth, useLoggedIn } from "../context/auth";
import { canonicalizeProgramName, programList } from "../info/Program";

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

  function handleLogout() {
    logout();
    // NOTE: we need to set the token to empty for application context state
    props.setToken("");
  }

  function loggedOutView() {
    return (
      <div className="buttons">
        <Link className="button is-primary" to="/signup">
          <strong>Sign up</strong>
        </Link>
        <Link className="button is-light" to="/login">
          Log In
        </Link>
      </div>
    );
  }

  function loggedInView() {
    return (
      <div className="navbar-item has-dropdown is-hoverable">
        <Link className="navbar-link has-text-weight-bold" to="/dashboard">
          {username}
        </Link>

        <div className="navbar-dropdown is-right">
          <Link className="navbar-item" to="/dashboard">
            <span className="icon pr-3">
              <i className="fas fa-home"></i>
            </span>
            Dashboard
          </Link>
          <Link className="navbar-item" to="/profile">
            <span className="icon pr-3">
              <i className="fas fa-user"></i>
            </span>
            Profile
          </Link>
          <hr className="navbar-divider"></hr>
          <Link className="navbar-item" to="logout" onClick={handleLogout}>
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
          <Link className="navbar-item has-text-weight-bold" to="/">
            MIT ESP
          </Link>

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
            <Link className="navbar-item has-text-weight-bold" to="/learn">
              Learn
            </Link>

            <Link className="navbar-item has-text-weight-bold" to="/teach">
              Teach
            </Link>

            <div className="navbar-item has-dropdown is-hoverable">
              <Link className="navbar-link has-text-weight-bold" to="/programs">
                Programs
              </Link>

              <div className="navbar-dropdown">
                {programList.map(program => (
                  <Link className="navbar-item" key={program} to={`/${program}`}>
                    {canonicalizeProgramName(program)}
                  </Link>
                ))}
              </div>
            </div>

            <Link className="navbar-item has-text-weight-bold" to="/aboutus">
              About Us
            </Link>
          </div>
          <div className="navbar-item">{loggedIn ? loggedInView() : loggedOutView()}</div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
