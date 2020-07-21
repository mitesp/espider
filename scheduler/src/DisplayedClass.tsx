import React from "react";
import ReactTooltip from "react-tooltip";
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
    <div>
      <div
        ref={drag}
        className="box"
        key={props.section.id}
        data-tip
        data-for={"classData-" + props.section.id}
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
      <ReactTooltip
        id={"classData-" + props.section.id}
        key={"classData-" + props.section.id}
        place="right"
        type="info"
        effect="solid"
      >
        <span>
          {props.section.name}
          <br />
          Show class information here
        </span>
      </ReactTooltip>
    </div>
  );
}
