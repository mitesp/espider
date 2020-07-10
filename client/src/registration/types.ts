// should match RegStatusOptions in the backend
// TODO figure out how to sync them
enum RegStatusOption {
  ClassPreferences = "CLASS_PREFERENCES",
  FrozenPreferences = "FROZEN_PREFERENCES",
  ChangeClasses = "CHANGE_CLASSES",
  PreProgram = "PRE_PROGRAM",
  DayOf = "DAY_OF",
  PostProgram = "POST_PROGRAM",
  Empty = "",
}

type ScheduledTimeslot = {
  timeslot: string;
  section: Section;
};

type Section = {
  clazz: number;
  name: string;
  num_students: number;
  number: number;
  scheduledblock_set: string[];
};

type Class = {
  id: number;
  title: string;
  description: string;
  capacity: number;
  section_set: Section[];
  teachers: string[];
};

export { RegStatusOption };

export type { Class, Section, ScheduledTimeslot };
