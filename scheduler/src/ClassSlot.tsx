import React, { useState } from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";

import { Section } from "./types";

type Props = {
  classroom: string;
  timeslot: string;
  getSection: (id: number) => Section;
  scheduleSection: (id: number, classroom: string, timeslot: string) => void;
};

export default function SectionSlot(props: Props) {
  const [section, setSection] = useState({} as Section);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "Section",
    drop: (item: { id: number } | undefined | any, monitor: DropTargetMonitor) => {
      // TODO figure out how to do this without using "any"
      const newSection = props.getSection(item.id);
      setSection(newSection);
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
      {section.id && `class ${section.clazz} sec ${section.number}`}
    </td>
  );
}
