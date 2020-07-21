import React from "react";
import { useDrag } from "react-dnd";

import { Section } from "./types";

type Props = {
  section: Section;
};

export default function DisplayedSection(props: Props) {
  const [, drag] = useDrag({
    item: { id: props.section.id, type: "Section" },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="box"
      key={props.section.id}
      data-tip
      data-for={"class-data" + props.section.id}
    >
      <div className="content">
        <p>
          <i>
            <strong>{props.section.clazz}</strong> - {props.section.name}
          </i>
          <br />
          Other relevant information
        </p>
      </div>
    </div>
  );
}
