import React from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";

import { Section, ScheduleSlot, Timeslot } from "./types";
import ScheduledClass from "./ScheduledClass";

type Props = {
  canSchedule: (sectionId: number, timeslot: Timeslot, classroom: string) => boolean;
  markAsSchedulable: (sectionId: number, slot: ScheduleSlot) => boolean;
  scheduleSection: (id: number, slot: ScheduleSlot) => void;
  section: Section;
  slot: ScheduleSlot;
};

export default function SectionSlot(props: Props) {
  const [{ canDrop, isOver, draggingItem }, drop] = useDrop({
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
      canDrop: monitor.canDrop(),
      draggingItem: monitor.getItem(),
    }),
  });

  let backgroundClassName = "";
  if (draggingItem && canDrop && isOver) {
    backgroundClassName = "has-background-success";
  } else if (draggingItem && props.markAsSchedulable(draggingItem.id, props.slot)) {
    backgroundClassName = "has-background-info";
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
