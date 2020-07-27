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
  length: number;
  name: string;
  number: number;
  scheduled_blocks: ScheduledBlock[];
};

export type Timeslot = {
  id: number;
  string: string;
};

export type ScheduledBlock = {
  classroom: string;
  section: number;
  timeslot: Timeslot;
};

export type ScheduleSlot = {
  classroom: string;
  timeslot: Timeslot;
  isOver: boolean;
};
