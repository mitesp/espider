
import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import { UserState } from '../App'
import "react-bulma-components/dist/react-bulma-components.min.css";

interface LoginProps {
  setState: Function;
  logged_in: Function;
  username: Function;
}

class LoginPage extends Component<LoginProps, UserState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      logged_in: props.logged_in(),
      username: props.username()
    };
  }

  setBothStates = (data: UserState) => {
    this.setState(data);
    this.props.setState(data);
  }


  componentDidMount() {
    console.log("Component mounted")
    if (this.state.logged_in) {
      console.log("logged in, getting user")
      fetch('http://localhost:8000/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          console.log(json.username)
          this.setBothStates({logged_in: this.state.logged_in, username: json.username });
        });
    }
  }

  handle_login = (e: React.FormEvent<HTMLFormElement>, data: UserState) => {
    this.setBothStates(data);
  }



  handle_logout = () => {
    localStorage.removeItem('token');
    console.log("logged out!")
    this.setBothStates({ logged_in: false, username: '' });
  };

  render() {
    return (
      <div>
          {this.state.logged_in
            ? <button className="button is-light" onClick={this.handle_logout}>Log Out</button>
            : <LoginForm setState={this.handle_login} />}
      </div>
      //TODO figure out how to get this to automatically change when logged in
    );
  }
}

export default LoginPage;
