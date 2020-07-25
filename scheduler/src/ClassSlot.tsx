import React from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";

import { Section, ScheduleSlot } from "./types";
import ScheduledClass from "./ScheduledClass";

type Props = {
  canSchedule: (sectionId: number, slot: ScheduleSlot) => boolean;
  slot: ScheduleSlot;
  section: Section;
  scheduleSection: (id: number, slot: ScheduleSlot) => void;
};

export default function SectionSlot(props: Props) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "Section",
    canDrop: (item: { id: number } | undefined | any, monitor: DropTargetMonitor) => {
      // TODO figure out how to do this without using "any"
      return item && !props.section && props.canSchedule(item.id, props.slot);
      // TODO add in based on availability
    },
    drop: (item: { id: number } | undefined | any, monitor: DropTargetMonitor) => {
      // TODO figure out how to do this without using "any"
      props.scheduleSection(item.id, props.slot);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  let backgroundClassName = "";
  if (canDrop && isOver) {
    backgroundClassName = "has-background-success";
  } else if (canDrop) {
    backgroundClassName = "has-background-info";
  }
  // TODO consider colorblindness in color selections

  return (
    <td className={backgroundClassName} ref={drop}>
      {props.section && <ScheduledClass section={props.section} />}
    </td>
  );
}
