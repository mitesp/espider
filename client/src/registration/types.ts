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

type Section = {
  num_students: number;
  number: number;
  scheduled_blocks: string[];
};

type Class = {
  id: string;
  title: string;
  description: string;
  capacity: number;
  sections: Section[];
  teachers: string[];
};

export { RegStatusOption };

export type { Class, Section };
