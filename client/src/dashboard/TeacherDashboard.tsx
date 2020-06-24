import React, { Component } from "react";

type JSONProgram = {
  name: string;
  edition: string;
};

type Program = {
  name: string;
  url: string;
};

type Props = {
  loggedIn: boolean;
  isTeacher: boolean;
  username: string;
};

type State = {
  programs: Program[];
};

class TeacherDashboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      programs: [],
    };
  }

  componentDidMount() {
    console.log(this.props.isTeacher);
    if (this.props.loggedIn) {
      this.get_programs();
    }
  }

  generate_program_list(results: Array<JSONProgram>) {
    console.log(results);
    const programs = Array<Program>(results.length);
    let counter = 0;
    results.forEach(function (r) {
      const name = r.name + " " + r.edition;
      const url = r.name + "_" + r.edition;
      let p: Program = { name: name, url: url };
      programs[counter] = p;
      counter++;
    });
    return programs;
  }

  get_programs() {
    if (this.props.loggedIn) {
      fetch("http://localhost:8000/api/programs/", {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ programs: this.generate_program_list(json.results) });
        });
    }
  }

  teacher_dashboard() {
    return (
      <div>
        <h1>
          <b>Teacher Dashboard for {this.props.username}</b>
        </h1>
        <br />
        <h2>
          <b>Active Programs</b>
        </h2>

        {this.state.programs.map((p, index) => {
          return (
            <h3 key={p.name}>
              {p.name}: <a href={p.url}>Register</a>
            </h3>
          );
        })}

        <br />
        <h2>
          <b>Previous Programs</b>
        </h2>
        <h3> None </h3>
      </div>
    );
  }

  not_teacher() {
    return <div>DASHBOARD</div>;
  }

  render() {
    return <div>{this.props.isTeacher ? this.teacher_dashboard() : this.not_teacher()}</div>;
  }
}

export default TeacherDashboard;