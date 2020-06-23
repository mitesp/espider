import React from "react";
import "react-bulma-components/dist/react-bulma-components.min.css";
import "./Nav.css";

import { canonicalizeProgramName, programList } from "../info/Program";

type Props = {
  logged_in: boolean;
  username: string;
  logout: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type State = {
  mobileOpen: boolean;
};

class Nav extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mobileOpen: false,
    };
  }

  toggleMobileMenu = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  loggedOutView = () => {
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

  loggedInView = () => {
    return (
      <div className="buttons">
        <h1> {this.props.username} </h1>
        <button className="button is-light" onClick={this.props.logout}>
          Log Out
        </button>
      </div>
    );
  }

  render() {
    const { mobileOpen } = this.state;
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            MIT ESP
          </a>

          <button
            type="button"
            className={`button-reset navbar-burger burger ${
              mobileOpen ? "is-active" : ""
            }`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbar"
            onClick={this.toggleMobileMenu}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div
          id="navbar"
          className={`navbar-menu ${mobileOpen ? "is-active" : ""}`}
        >
          {/* <div className="navbar-start"></div> */}

          <div className="navbar-end">
            <a className="navbar-item" href="/aboutus">
              About Us
            </a>

            <a className="navbar-item" href="/learn">
              Learn
            </a>

            <a className="navbar-item" href="/teach">
              Teach
            </a>

            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link" href="/programs">
                Programs
              </a>

              <div className="navbar-dropdown">
                {programList.map((program) => (
                  <a className="navbar-item" key={program} href={`/${program}`}>
                    {canonicalizeProgramName(program)}
                  </a>
                ))}
              </div>
            </div>
            <div className="navbar-item">
              {this.props.logged_in ? this.loggedInView() : this.loggedOutView()}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Nav;