import React from "react";

interface SignupProps {
  setState: Function;
}

interface SignupState {
  username: string;
  password: string;
}

function isValidField(prop: string, obj: SignupState): prop is keyof SignupState {
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
      .then(res => res.json())
      .then(json => {
        localStorage.setItem("token", json.token);
        this.props.setState({
          logged_in: true,
          username: json.username,
        });
      });
  };

  render() {
    return (
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handle_signup(e, this.state)}>
        <h2>Sign Up</h2>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.handle_change}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handle_change}
        />
        <input type="submit" />
      </form>
    );
  }
}

export default SignupForm;
