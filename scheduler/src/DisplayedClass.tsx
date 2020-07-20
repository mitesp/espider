import React from "react";
import ReactTooltip from "react-tooltip";
import { useDrag } from "react-dnd";

import { Class } from "./types";

type Props = {
  clazz: Class;
};

export default function DisplayedClass(props: Props) {
  const [, drag] = useDrag({
    item: { id: props.clazz.id, type: "Class" },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="box"
      key={props.clazz.id}
      data-tip
      data-for={"class-data" + props.clazz.id}
    >
      <div className="content">
        <p>
          <i>
            <strong>{props.clazz.id}</strong> - {props.clazz.title}
          </i>
          <br />
          {props.clazz.capacity} students
        </p>
      </div>
      <ReactTooltip
        id={"class-data" + props.clazz.id}
        key={"class-data" + props.clazz.id}
        place="top"
        type="info"
        effect="solid"
      >
        {/*TODO figure out how to hide tooltip when dragging*/}
        <span>Show {props.clazz.title} information</span>
      </ReactTooltip>
    </div>
  );
}
