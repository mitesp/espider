import React from "react";

interface SignupProps {
  setState: Function;
}

interface SignupState {
  username: string;
  password: string;
}

function isValidField(
  prop: string,
  obj: SignupState
): prop is keyof SignupState {
  return prop in obj;
}

class SignupForm extends React.Component<SignupProps, SignupState> {
  constructor(props: SignupProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handle_change = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    this.setState((prevstate: SignupState) => {
      const newState = { ...prevstate };
      if (isValidField(name, prevstate)) {
        newState[name] = value;
      }
      return newState;
    });
  };

  handle_signup = (e: React.FormEvent<HTMLFormElement>, data: SignupState) => {
    e.preventDefault();
    fetch("http://localhost:8000/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        localStorage.setItem("token", json.token);
        this.props.setState({
          logged_in: true,
          username: json.username,
        });
      });
  };

  render() {
    return (
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
          this.handle_signup(e, this.state)
        }
      >
        {/* Validation elements are concurrently commented out */}
        <div className="field">
          <label className="label" htmlFor="username">
            Username
          </label>
          <div className="control has-icons-left has-icons-right">
            <input
              // is-success is-danger
              className="input"
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handle_change}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-user"></i>
            </span>
            {/* <span className="icon is-small is-right">
              <i className="fas fa-check"></i>
            </span> */}
          </div>
          {/* <p className="help is-success">This username is available</p> */}
        </div>

        <div className="field">
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="control has-icons-left has-icons-right">
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handle_change}
            />
            {/* <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span> */}
            {/* <span className="icon is-small is-right">
              <i className="fas fa-exclamation-triangle"></i>
            </span> */}
          </div>
          {/* <p className="help is-danger">This  is invalid</p> */}
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-link" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default SignupForm;
