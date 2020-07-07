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
  clazz: Clazz;
};

type Section = {
  num_students: number;
  number: number;
};

type Class = {
  id: string;
  title: string;
  description: string;
  capacity: number;
  section_set: Section[];
  teachers: string[];
};



export { RegStatusOption };


export type { Class, Section, ScheduledTimeslot };
