import React, { useState } from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";

import { Class } from "./types";

type Props = {
  classroom: string;
  timeslot: string;
  getClass: (id: number) => Class;
};

export default function ClassSlot(props: Props) {
  const [clazz, setClazz] = useState({} as Class);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "Class",
    drop: (item: { id: number } | undefined | any, monitor: DropTargetMonitor) => {
      // TODO figure out how to do this without using "any"
      const newClazz = props.getClass(item.id);
      setClazz(newClazz);
      if (item) {
        console.log(`You moved ${item.id} to ${props.timeslot}/${props.classroom}.`);
      }
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
    <th className={backgroundClassName} ref={drop} key={props.timeslot + "/" + props.classroom}>
      {clazz && clazz.id}
    </th>
  );
}
