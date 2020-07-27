import React, { useEffect, useState, useCallback } from "react";
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
import { Section, Timeslot, ScheduledBlock, ScheduleSlot } from "./types";

type Props = {
  programName: string;
  programEdition: string;
};

export default function Scheduler(props: Props) {
  const [timeslots, setTimeslots] = useState([] as Timeslot[]);
  const [classrooms, setClassrooms] = useState([] as string[]);
  const [sections, setSections] = useState([] as Section[]);
  const [unscheduledSections, setUnscheduledSections] = useState([] as Section[]);
  const [slots, setSlots] = useState([] as ScheduleSlot[][]);

  const programURL = `${props.programName}/${props.programEdition}`;

  function getSlotsCopy() {
    const newSlots = [];
    for (let i = 0; i < slots.length; i++) {
      const row = slots[i];
      const newRow = [];
      for (let j = 0; j < row.length; j++) {
        newRow.push({ ...row[j], isOver: false });
      }
      newSlots.push(newRow);
    }
    return newSlots;
  }

  function resetIsOver() {
    const newSlots = getSlotsCopy();
    setSlots(newSlots);
  }

  const resetSections = useCallback(() => {
    axiosInstance.get(`/${programURL}/${sectionsEndpoint}`).then(res => {
      setSections(res.data);
      setUnscheduledSections(
        (res.data as Section[]).filter(section => section.scheduled_blocks.length === 0)
      );
    });
  }, [programURL]);

  useEffect(() => {
    // Set up timeslots
    axiosInstance.get(`/${programURL}/${timeslotEndpoint}`).then(res => {
      setTimeslots(res.data); // TODO assumed to be in chronological order
    });
    // Set up classrooms
    axiosInstance.get(`/${programURL}/${classroomEndpoint}`).then(res => {
      setClassrooms(res.data);
    });
    // Set up sections
    resetSections();
  }, [programURL, props.programEdition, props.programName, resetSections]);

  useEffect(() => {
    const newSlots = [] as ScheduleSlot[][];
    for (let i = 0; i < classrooms.length; i++) {
      const classroomSlots = [] as ScheduleSlot[];
      for (let j = 0; j < timeslots.length; j++) {
        const slot = { classroom: classrooms[i], timeslot: timeslots[j], isOver: false };
        classroomSlots.push(slot);
      }
      newSlots[i] = classroomSlots;
    }
    setSlots(newSlots);
  }, [timeslots, classrooms]);

  function getSectionById(id: number) {
    return sections.filter(section => section.id === id)[0];
  }

  function getScheduledSectionInSlot(timeslot: Timeslot, classroom: string) {
    return sections.filter(
      section =>
        section.scheduled_blocks.length > 0 &&
        section.scheduled_blocks.filter(
          scheduledBlock =>
            scheduledBlock.timeslot.id === timeslot.id && scheduledBlock.classroom === classroom
        ).length > 0
    )[0];
  }

  function canSchedule(sectionId: number, timeslot: Timeslot, classroom: string) {
    const section = getSectionById(sectionId);
    const timeslotIndex = timeslots.indexOf(timeslot);
    if (timeslotIndex + section.length > timeslots.length) {
      return false;
    }
    for (let i = 0; i < section.length; i++) {
      const blockTimeslot = timeslots[timeslotIndex + i];
      if (getScheduledSectionInSlot(blockTimeslot, classroom)) {
        return false;
      }
    }
    return true;
  }

  function canScheduleOverall(sectionId: number, slot: ScheduleSlot) {
    const section = getSectionById(sectionId);
    const timeslotIndex = timeslots.indexOf(slot.timeslot);
    for (let i = 0; i < section.length; i++) {
      const startingTimeslotIndex = timeslotIndex - i;
      if (startingTimeslotIndex >= 0) {
        const timeslot = timeslots[startingTimeslotIndex];
        if (canSchedule(sectionId, timeslot, slot.classroom)) {
          return true;
        }
      }
    }
    return false;
  }

  function updateNeighbors(sectionId: number, slot: ScheduleSlot, isOver: boolean) {
    const newSlots = getSlotsCopy();
    const section = getSectionById(sectionId);
    const timeslotIndex = timeslots.indexOf(slot.timeslot);
    const classroomIndex = classrooms.indexOf(slot.classroom);
    if (!canSchedule(sectionId, slot.timeslot, slot.classroom)) {
      setSlots(newSlots);
      return;
    }
    for (let i = 0; i < section.length; i++) {
      const laterTimeslotIndex = timeslotIndex + i;
      if (laterTimeslotIndex < timeslots.length) {
        const laterSlot = newSlots[classroomIndex][laterTimeslotIndex];
        laterSlot.isOver = canScheduleOverall(sectionId, laterSlot) && (laterSlot.isOver || isOver);
      }
    }
    setSlots(newSlots);
  }

  function scheduleSection(id: number, slot: ScheduleSlot) {
    const section = getSectionById(id);
    const scheduledBlocks = [] as ScheduledBlock[];
    const timeslotIndex = timeslots.indexOf(slot.timeslot);
    if (timeslotIndex + section.length > timeslots.length) {
      return;
    }
    for (let i = 0; i < section.length; i++) {
      const scheduledBlock = {
        section: id,
        classroom: slot.classroom,
        timeslot: timeslots[timeslotIndex + i],
      };
      scheduledBlocks.push(scheduledBlock);
    }
    // TODO sort ^ by clazz
    axiosInstance
      .post(`/${programURL}/${scheduleSectionEndpoint}/${id}/`, {
        scheduled_blocks: scheduledBlocks,
      })
      .then(res => {
        console.log(`Scheduled section ${id} in ${slot.classroom} at ${slot.timeslot.string}`);
        // TODO check if success or error
        resetSections();
      });
  }

  function unscheduleSection(id: number) {
    const section = getSectionById(id);
    // TODO sort ^ by clazz
    if (section.scheduled_blocks.length > 0) {
      axiosInstance.post(`/${programURL}/${unscheduleSectionEndpoint}/${id}/`).then(res => {
        console.log(`Uncheduled section ${id}`);
        // TODO check if success or error
        resetSections();
      });
    }
  }

  function getScheduledBlockIndex(section: Section, timeslot: Timeslot) {
    if (!section) {
      return -1;
    }
    const sectionBlocks = section.scheduled_blocks;
    return sectionBlocks.map(block => block.timeslot.id).indexOf(timeslot.id);
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
                  {classrooms.map((classroom, classroomIndex) => {
                    return (
                      <tr key={"classroom" + classroomIndex}>
                        <th data-tip data-for={"classroomData-" + classroom}>
                          {classroom}
                        </th>
                        {timeslots.map((timeslot, timeslotIndex) => {
                          const section = getScheduledSectionInSlot(timeslot, classroom);
                          const slot =
                            slots.length > 0 ? slots[classroomIndex][timeslotIndex] : undefined;
                          const blockIndex = getScheduledBlockIndex(section, timeslot);
                          if (slot && (!section || blockIndex === 0)) {
                            return (
                              <ClassSlot
                                key={`${timeslot.id}/${classroom}`}
                                canSchedule={canSchedule}
                                markAsSchedulable={canScheduleOverall}
                                resetIsOver={resetIsOver}
                                slot={slot}
                                scheduleSection={scheduleSection}
                                section={section}
                                updateNeighbors={updateNeighbors}
                              />
                            );
                          } else {
                            return null;
                          }
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
