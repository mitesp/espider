import React from "react";
import { useDrag } from "react-dnd";

import { Section } from "./types";

type Props = {
  section: Section;
};

export default function ScheduledClass(props: Props) {
  const [, drag] = useDrag({
    item: { id: props.section.id, type: "Section" },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return <span ref={drag}>{`class ${props.section.clazz} sec ${props.section.number}`}</span>;
}
