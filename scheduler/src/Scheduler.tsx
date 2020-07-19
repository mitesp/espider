import React, { Component } from "react";
import axiosInstance from "./axiosAPI";
import { timeslotEndpoint, classroomEndpoint, classesEndpoint } from "./apiEndpoints";
import { Class } from "./types";

type Props = {
  programName: string;
  programEdition: string;
};

type State = {
  timeslots: string[];
  classrooms: string[];
  classes: Class[];
};

export default class Scheduler extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      timeslots: [],
      classrooms: [],
      classes: [],
    };
  }

  componentDidMount() {
    this.setupClasses();
    this.setupTimeslots();
    this.setupClassrooms();
  }

  setupClasses() {
    axiosInstance
      .get(`/${this.props.programName}/${this.props.programEdition}/${classesEndpoint}`)
      .then(res => {
        this.setState({
          classes: res.data,
        });
      });
  }

  setupTimeslots() {
    axiosInstance
      .get(`/${this.props.programName}/${this.props.programEdition}/${timeslotEndpoint}`)
      .then(res => {
        this.setState({
          timeslots: res.data,
        });
      });
  }

  setupClassrooms() {
    axiosInstance
      .get(`/${this.props.programName}/${this.props.programEdition}/${classroomEndpoint}`)
      .then(res => {
        this.setState({
          classrooms: res.data,
        });
      });
  }

  renderClass = (clazz: Class) => {
    return (
      <div className="box" key={clazz.id}>
        <div className="content">
          <p>
            <strong>{clazz.title}</strong>
            <br />
            {clazz.description}
          </p>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="container content">
        <div className="columns">
          <div className="column has-text-centered has-background-success-light">
            <h1>
              Scheduler for {this.props.programName} {this.props.programEdition}
            </h1>
            <div className="table-container">
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th></th>
                    {this.state.timeslots.map((timeslot, index) => {
                      return <th key={"timeslot" + index}>{timeslot}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {this.state.classrooms.map((classroom, index) => {
                    return (
                      <tr key={"classroom" + index}>
                        <th>{classroom}</th>
                        {this.state.timeslots.map((timeslot, index) => {
                          return <th key={"classroom" + index + "timeslot" + index}></th>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="column is-3 has-text-centered">
            <p>Filter options here (maybe based on whatever the new equivalent of tags is)</p>
            {this.state.classes.map(this.renderClass)}
          </div>
        </div>
      </div>
    );
  }
}
