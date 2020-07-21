import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import DisplayedClass from "./DisplayedClass";
import ClassSlot from "./ClassSlot";

import axiosInstance from "./axiosAPI";
import { timeslotEndpoint, classroomEndpoint, sectionsEndpoint } from "./apiEndpoints";
import { Section } from "./types";

type Props = {
  programName: string;
  programEdition: string;
};

export default function Scheduler(props: Props) {
  const [timeslots, setTimeslots] = useState([] as string[]);
  const [classrooms, setClassrooms] = useState([] as string[]);
  const [sections, setSections] = useState([] as Section[]);
  const [unscheduledSections, setUnscheduledSections] = useState([] as Section[]);

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
    // Set up sections
    axiosInstance
      .get(`/${props.programName}/${props.programEdition}/${sectionsEndpoint}`)
      .then(res => {
        setSections(res.data);
        setUnscheduledSections(res.data);
      });
  }, [props.programEdition, props.programName]);

  function getSectionById(id: number) {
    return sections.filter(section => section.id === id)[0];
  }

  function scheduleSection(id: number, classroom: string, timeslot: string) {
    const section = getSectionById(id);
    if (section.timeslot) {
      section.timeslot = timeslot;
      section.classroom = classroom;
    } else {
      section.timeslot = timeslot;
      section.classroom = classroom;
    }
    setUnscheduledSections(sections.filter(section => section.timeslot === undefined));
    // TODO sort ^ by clazz
    // TODO send API call to actually schedule the section
    console.log(`Scheduled section ${id} in ${classroom} at ${timeslot}`);
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
              <table className="table is-fullwidth is-striped is-hoverable is-bordered">
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
                        <th data-tip data-for={"classroomData-" + classroom}>
                          {classroom}
                        </th>
                        {timeslots.map((timeslot, index) => {
                          return (
                            <ClassSlot
                              key={`${timeslot}/${classroom}`}
                              timeslot={timeslot}
                              classroom={classroom}
                              section={
                                sections.filter(
                                  section =>
                                    section.timeslot === timeslot && section.classroom === classroom
                                )[0]
                              }
                              scheduleSection={scheduleSection}
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
                    id={"classroomData-" + classroom}
                    key={"classroomData-" + classroom}
                    place="right"
                    type="info"
                    effect="solid"
                  >
                    <span>Show {classroom} information</span>
                  </ReactTooltip>
                );
              })}
              {sections.map((section, index) => {
                return (
                  <ReactTooltip
                    id={"classData-" + section.id}
                    key={"classData-" + section.id}
                    place="right"
                    type="info"
                    effect="solid"
                  >
                    <span>
                      {section.name}
                      <br />
                      Show class information here
                    </span>
                  </ReactTooltip>
                );
              })}
            </div>
          </div>
          <div className="column is-3 has-text-centered">
            <p>Filter options here (maybe based on whatever the new equivalent of tags is)</p>
            {unscheduledSections.map(section => (
              <DisplayedClass key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
