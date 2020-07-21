import React, { useState } from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";

import { Class } from "./types";

type Props = {
  classroom: string;
  timeslot: string;
  getClass: (id: number) => Class;
  scheduleClass: (id: number, classroom: string, timeslot: string) => void;
};

export default function ClassSlot(props: Props) {
  const [clazz, setClazz] = useState({} as Class);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "Class",
    drop: (item: { id: number } | undefined | any, monitor: DropTargetMonitor) => {
      // TODO figure out how to do this without using "any"
      const newClazz = props.getClass(item.id);
      setClazz(newClazz);
      props.scheduleClass(item.id, props.classroom, props.timeslot);
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
      {clazz.id && clazz.id}
    </td>
  );
}
