import React from "react";

import { Class } from "./types";

type Props = {
  classroom: string;
  timeslot: string;
  clazz?: Class;
};

export default function ClassSlot(props: Props) {
  return <th key={props.classroom + "/" + props.timeslot}></th>;
}
