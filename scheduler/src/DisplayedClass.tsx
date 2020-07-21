import React from "react";
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
    </div>
  );
}
