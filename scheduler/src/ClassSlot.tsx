import React, { useEffect, useCallback } from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";

import { Section, ScheduleSlot, Timeslot } from "./types";
import ScheduledClass from "./ScheduledClass";

type Props = {
  canSchedule: (sectionId: number, timeslot: Timeslot, classroom: string) => boolean;
  markAsSchedulable: (sectionId: number, slot: ScheduleSlot) => boolean;
  resetIsOver: () => void;
  scheduleSection: (id: number, slot: ScheduleSlot) => void;
  section: Section;
  slot: ScheduleSlot;
  updateNeighbors: (sectionId: number, slot: ScheduleSlot, isOver: boolean) => void;
};

export default function SectionSlot(props: Props) {
  const [{ isOver, draggingItem }, drop] = useDrop({
    accept: "Section",
    canDrop: (item: { id: number } | undefined | any, monitor: DropTargetMonitor) => {
      // TODO figure out how to do this without using "any"
      return (
        item &&
        !props.section &&
        props.canSchedule(item.id, props.slot.timeslot, props.slot.classroom)
      );
      // TODO add in based on availability
    },
    drop: (item: { id: number } | undefined | any, monitor: DropTargetMonitor) => {
      // TODO figure out how to do this without using "any"
      props.scheduleSection(item.id, props.slot);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      draggingItem: monitor.getItem(),
    }),
  });

  const updateNeighbors = useCallback(() => {
    if (draggingItem && isOver) {
      props.updateNeighbors(draggingItem.id, props.slot, isOver);
    }
  }, [isOver, draggingItem, props]);

  const resetIsOver = useCallback(() => {
    if (!draggingItem) {
      props.resetIsOver();
    }
  }, [draggingItem, props]);

  useEffect(updateNeighbors, [isOver]);

  useEffect(resetIsOver, [draggingItem]);

  const markAsSchedulable = draggingItem
    ? props.markAsSchedulable(draggingItem.id, props.slot)
    : false;

  let backgroundClassName = "";
  if (props.section) {
    backgroundClassName = "has-background-grey-lighter";
  } else if (draggingItem && props.slot.isOver) {
    backgroundClassName = "has-background-success";
  } else if (markAsSchedulable) {
    backgroundClassName = "has-background-info";
  } else if (draggingItem) {
    backgroundClassName = "has-background-grey-light";
  }
  // TODO consider colorblindness in color selections

  return (
    <td
      className={backgroundClassName}
      ref={drop}
      colSpan={props.section ? props.section.length : 1}
    >
      {props.section && <ScheduledClass section={props.section} />}
    </td>
  );
}
