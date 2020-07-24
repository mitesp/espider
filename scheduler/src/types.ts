export type Class = {
  id: number;
  title: string;
  description: string;
  capacity: number;
  teachers: string[];
};

export type Section = {
  id: number;
  clazz: number;
  name: string;
  number: number;
  timeslot?: Timeslot; // TODO make this multi-block friendly
  classroom?: string;
};

export type Timeslot = {
  id: number;
  string: string;
};
