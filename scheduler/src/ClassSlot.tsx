import React from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";

import { Section } from "./types";
import ScheduledClass from "./ScheduledClass";

type Props = {
  classroom: string;
  timeslot: string;
  section: Section;
  scheduleSection: (id: number, classroom: string, timeslot: string) => void;
};

export default function SectionSlot(props: Props) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "Section",
    drop: (item: { id: number } | undefined | any, monitor: DropTargetMonitor) => {
      // TODO figure out how to do this without using "any"
      props.scheduleSection(item.id, props.classroom, props.timeslot);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(), // TODO this should be based on availability
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
