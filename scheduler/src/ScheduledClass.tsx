import React from "react";
import ReactTooltip from "react-tooltip";
import { useDrag, DragSourceMonitor } from "react-dnd";

import { Section } from "./types";

type Props = {
  section: Section;
  unscheduleSection: (sectionId: number) => void;
};

export default function ScheduledClass(props: Props) {
  const [, drag] = useDrag({
    item: { id: props.section.id, type: "Section" },
    begin: (monitor: DragSourceMonitor) => {
      // TODO figure out how to do this without using "any"
      props.unscheduleSection(props.section.id);
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div>
      <span
        ref={drag}
        data-tip
        data-for={"classData-" + props.section.id}
        className="is-size-6 has-text-centered is-italic"
      >
        {`class ${props.section.clazz} sec ${props.section.number}`}
      </span>
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
