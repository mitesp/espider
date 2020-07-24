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
  scheduled_blocks: ScheduledBlock[];
};

export type Timeslot = {
  id: number;
  string: string;
};

export type ScheduledBlock = {
  section: number;
  timeslot: Timeslot;
  classroom: string;
};
