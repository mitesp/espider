import React, { Component } from 'react';

type JSONProgram = {
  name: string;
  edition: string;
}

type Program = {
  name: string;
  url: string;
}

type Props = {
  logged_in: boolean;
  username: string;
}

type State = {
  is_student: boolean;
  programs: Program[];
}

class StudentDashboard extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      is_student: false,
      programs: []
    };
  }

  componentDidMount() {
    if (this.props.logged_in) {
      this.get_is_student();
      this.get_programs();
    }
  }

  get_is_student= async() => {
    if (this.props.logged_in) {
      const response = await fetch('http://localhost:8000/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
      const json = await response.json()
      this.setState({is_student:json.is_student});
    }
  }

  generate_program_list(results: Array<JSONProgram>) {
    const programs = Array<Program>(results.length);
    let counter = 0;
    results.forEach(function(r) {
      const name = r.name + " " + r.edition;
      const url = r.name + "_" + r.edition;
      let p : Program = {name: name, url: url};
      programs[counter] = p;
      counter++;
    });
    return programs;
  }

  get_programs() {
    if (this.props.logged_in) {
      fetch('http://localhost:8000/api/programs/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({programs: this.generate_program_list(json.results)});
        });
    }
  }


  student_dashboard() {
    return (
      <div>
        <h1> <b>Student Dashboard for {this.props.username}</b> </h1>
        <br />
        <h2> <b>Active Programs</b> </h2>

        {this.state.programs.map((p, index) => {
          return <h3 key={p.name}>{p.name}: <a href={p.url}>Register</a></h3>
          })
        }

        <br />
        <h2> <b>Previous Programs</b> </h2>
        <h3> None </h3>
      </div>
    );
  }

  not_student() {
    return <div>DASHBOARD</div>;
  }

  render() {
    return (
      <div>
          {this.state.is_student
            ? this.student_dashboard()
            : this.not_student()}
      </div>
    );
  }
}

export default StudentDashboard;
