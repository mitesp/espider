import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import DisplayedClass from "./DisplayedClass";
import ClassSlot from "./ClassSlot";

import axiosInstance from "./axiosAPI";
import { timeslotEndpoint, classroomEndpoint, classesEndpoint } from "./apiEndpoints";
import { Class } from "./types";

type Props = {
  programName: string;
  programEdition: string;
};

export default function Scheduler(props: Props) {
  const [timeslots, setTimeslots] = useState([] as string[]);
  const [classrooms, setClassrooms] = useState([] as string[]);
  const [classes, setClasses] = useState([] as Class[]);

  useEffect(() => {
    // Set up timeslots
    axiosInstance
      .get(`/${props.programName}/${props.programEdition}/${timeslotEndpoint}`)
      .then(res => {
        setTimeslots(res.data);
      });
    // Set up classrooms
    axiosInstance
      .get(`/${props.programName}/${props.programEdition}/${classroomEndpoint}`)
      .then(res => {
        setClassrooms(res.data);
      });
    // Set up classes
    axiosInstance
      .get(`/${props.programName}/${props.programEdition}/${classesEndpoint}`)
      .then(res => {
        setClasses(res.data);
      });
  }, [props.programEdition, props.programName]);

  function getClassById(id: number) {
    return classes.filter(clazz => clazz.id === id)[0];
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container content">
        <div className="columns">
          <div className="column has-text-centered has-background-success-light">
            <h1>
              Scheduler for {props.programName} {props.programEdition}
            </h1>
            <div className="table-container">
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th></th>
                    {timeslots.map((timeslot, index) => {
                      return <th key={"timeslot" + index}>{timeslot}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {classrooms.map((classroom, index) => {
                    return (
                      <tr key={"classroom" + index}>
                        <th data-tip data-for={"classroom-data" + index}>
                          {classroom}
                        </th>
                        {timeslots.map((timeslot, index) => {
                          return (
                            <ClassSlot
                              timeslot={timeslot}
                              classroom={classroom}
                              getClass={getClassById}
                            />
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {classrooms.map((classroom, index) => {
                return (
                  <ReactTooltip
                    id={"classroom-data" + index}
                    key={"classroom-data" + index}
                    place="right"
                    type="info"
                    effect="solid"
                  >
                    <span>Show {classroom} information</span>
                  </ReactTooltip>
                );
              })}
            </div>
          </div>
          <div className="column is-3 has-text-centered">
            <p>Filter options here (maybe based on whatever the new equivalent of tags is)</p>
            {classes.map(clazz => (
              <DisplayedClass clazz={clazz} />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
