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
  timeslot?: string; // TODO make this multi-block friendly
  classroom?: string;
};
