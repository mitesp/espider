import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import ClassList from "./ClassList";
import ClassSlot from "./ClassSlot";

import axiosInstance from "./axiosAPI";
import {
  timeslotEndpoint,
  classroomEndpoint,
  sectionsEndpoint,
  scheduleSectionEndpoint,
  unscheduleSectionEndpoint,
} from "./apiEndpoints";
import { Section, Timeslot } from "./types";

type Props = {
  programName: string;
  programEdition: string;
};

export default function Scheduler(props: Props) {
  const [timeslots, setTimeslots] = useState([] as Timeslot[]);
  const [classrooms, setClassrooms] = useState([] as string[]);
  const [sections, setSections] = useState([] as Section[]);
  const [unscheduledSections, setUnscheduledSections] = useState([] as Section[]);

  const programURL = `${props.programName}/${props.programEdition}`;

  useEffect(() => {
    // Set up timeslots
    axiosInstance.get(`/${programURL}/${timeslotEndpoint}`).then(res => {
      setTimeslots(res.data);
    });
    // Set up classrooms
    axiosInstance.get(`/${programURL}/${classroomEndpoint}`).then(res => {
      setClassrooms(res.data);
    });
    // Set up sections
    axiosInstance.get(`/${programURL}/${sectionsEndpoint}`).then(res => {
      setSections(res.data);
      setUnscheduledSections(
        (res.data as Section[]).filter(section => section.scheduled_blocks.length === 0)
      );
    });
  }, [programURL, props.programEdition, props.programName]);

  function getSectionById(id: number) {
    return sections.filter(section => section.id === id)[0];
  }

  function scheduleSection(id: number, classroom: string, timeslot: Timeslot) {
    const section = getSectionById(id);
    const scheduledBlock = { section: id, classroom: classroom, timeslot: timeslot };
    section.scheduled_blocks = [scheduledBlock];
    setUnscheduledSections(sections.filter(section => section.scheduled_blocks.length === 0));
    // TODO sort ^ by clazz
    axiosInstance
      .post(`/${programURL}/${scheduleSectionEndpoint}/${id}/`, {
        timeslot: timeslot.id,
        classroom: classroom,
      })
      .then(res => {
        console.log(`Scheduled section ${id} in ${classroom} at ${timeslot.string}`);
        // TODO check if success or error
      });
  }

  function unscheduleSection(id: number) {
    const section = getSectionById(id);
    section.scheduled_blocks = [];
    setUnscheduledSections(sections.filter(section => section.scheduled_blocks.length === 0));
    // TODO sort ^ by clazz
    axiosInstance.post(`/${programURL}/${unscheduleSectionEndpoint}/${id}/`).then(res => {
      console.log(`Uncheduled section ${id}`);
      // TODO check if success or error
    });
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
                      return <th key={`timeslot${timeslot.id}`}>{timeslot.string}</th>;
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
                              key={`${timeslot.id}/${classroom}`}
                              timeslot={timeslot}
                              classroom={classroom}
                              section={
                                sections.filter(
                                  section =>
                                    section.scheduled_blocks.length > 0 &&
                                    section.scheduled_blocks.filter(
                                      scheduledBlock =>
                                        scheduledBlock.timeslot.id === timeslot.id &&
                                        scheduledBlock.classroom === classroom
                                    ).length > 0
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
            </div>
          </div>
          <ClassList sections={unscheduledSections} unscheduleSection={unscheduleSection} />
        </div>
      </div>
    </DndProvider>
  );
}
