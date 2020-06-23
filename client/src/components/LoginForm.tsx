import React from 'react';


interface LoginProps {
  setState: Function;
}

interface LoginState {
  username: string;
  password: string;
}

function isValidField(prop: string, obj: LoginState): prop is keyof LoginState {
  return prop in obj;
}

class LoginForm extends React.Component<LoginProps,LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  handle_change = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    this.setState((prevstate: LoginState) => {
      const newState = { ...prevstate };
      if (isValidField(name, prevstate)) {
        newState[name] = value;
      }
      return newState;
    });
  };

  handle_login = (e: React.FormEvent<HTMLFormElement>, data: LoginState) => {
    e.preventDefault();
    console.log(JSON.stringify(data));
    fetch('http://localhost:8000/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        console.log("retrieved token")
        this.props.setState({
          logged_in: true,
          username: json.user.username
        });
      });
  };

  render() {
    return (
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handle_login(e, this.state)}>
        <h2>Log In</h2>
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

export default LoginForm;

// LoginForm.propTypes = {
//   handle_login: PropTypes.func.isRequired
// };
