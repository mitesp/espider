
import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import { UserState } from '../App'
import "react-bulma-components/dist/react-bulma-components.min.css";

interface LoginProps {
  setState: (data: UserState) => void;
  logged_in: boolean;
  username: string;
}

class LoginPage extends Component<LoginProps, any> {
  constructor(props: LoginProps) {
    super(props);
  }

  setBothStates = (data: UserState) => {
    this.setState(data);
    this.props.setState(data);
  }

  handle_login = (e: React.FormEvent<HTMLFormElement>, data: UserState) => {
    this.props.setState(data);
  }



  handle_logout = () => {
    localStorage.removeItem('token');
    this.props.setState({ logged_in: false, username: '' });
  };

  render() {
    return (
      <div>
          {this.props.logged_in
            ? <h3> Hi, {this.props.username}! </h3>
            : <LoginForm setState={this.handle_login} />}
      </div>
      //TODO figure out how to get this to automatically change when logged in
    );
  }
}

export default LoginPage;
