import React from "react";
import "react-bulma-components/dist/react-bulma-components.min.css";

import programs, { canonicalizeProgramName } from "../info/programs";

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
    };
  }

  toggleMobileMenu = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { mobileOpen } = this.state;
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            MIT ESP
          </a>

          <a
            role="button"
            className={`navbar-burger burger ${mobileOpen ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbar"
            onClick={this.toggleMobileMenu}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="navbar"
          className={`navbar-menu ${mobileOpen ? "is-active" : ""}`}
        >
          {/* <div className="navbar-start"></div> */}

          <div className="navbar-end">
            <a className="navbar-item" href="/learn">
              Learn
            </a>

            <a className="navbar-item" href="/teach">
              Teach
            </a>

            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">Programs</a>

              <div className="navbar-dropdown">
                {programs.map((program) => (
                  <a className="navbar-item" key={program} href={`/${program}`}>
                    {canonicalizeProgramName(program)}
                  </a>
                ))}
              </div>
            </div>
            <div className="navbar-item">
              <div className="buttons">
                <a className="button is-primary">
                  <strong>Sign up</strong>
                </a>
                <a className="button is-light">Log in</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Nav;
