import React from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";

import DisplayedClass from "./DisplayedClass";
import { Section } from "./types";

type Props = {
  sections: Section[];
  unscheduleSection: (id: number) => void;
};

export default function Scheduler(props: Props) {
  const [, drop] = useDrop({
    accept: "Section",
    drop: (item: { id: number } | undefined | any, monitor: DropTargetMonitor) => {
      // TODO figure out how to do this without using "any"
      props.unscheduleSection(item.id);
    },
  });

  return (
    <div className="column is-3 has-text-centered" ref={drop}>
      <p>Filter options here (maybe based on whatever the new equivalent of tags is)</p>
      {props.sections.map(section => (
        <DisplayedClass key={section.id} section={section} />
      ))}
    </div>
  );
}
