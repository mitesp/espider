import React from "react";
import "./Nav.css";

type Props = {
  loggedIn: boolean;
  username: string;
  logout: () => void;
};

type State = {};

class Nav extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mobileOpen: false,
    };
  }

  loggedOutView = () => {
    return (
      <div className="buttons">
        <a className="button is-light" href="/login">
          Log In
        </a>
      </div>
    );
  };

  loggedInView = () => {
    return (
      <div>
        <h1 className="navbar-item has-text-weight-bold">{this.props.username}</h1>

        <a className="navbar-item" href="/logout" onClick={this.props.logout}>
          Log Out
        </a>
      </div>
    );
  };

  render() {
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
          </div>
          {/* <div className="navbar-start"></div> */}

          <div className="navbar-end"> </div>
          <div className="navbar-item">
            {this.props.loggedIn ? this.loggedInView() : this.loggedOutView()}
          </div>
        </div>
      </nav>
    );
  }
}

export default Nav;
