// should match RegStatusOptions in the backend
// TODO figure out how to sync them

type Clazz = {
  id: string;
  title: string;
  description: string;
  teachers: string[];
  capacity: number;
  num_students: number;
  expanded: boolean;
};

enum RegStatusOption {
  ClassPreferences = "CLASS_PREFERENCES",
  FrozenPreferences = "FROZEN_PREFERENCES",
  ChangeClasses = "CHANGE_CLASSES",
  PreProgram = "PRE_PROGRAM",
  DayOf = "DAY_OF",
  PostProgram = "POST_PROGRAM",
  Empty = "",
}

export { RegStatusOption };

export type { Clazz };
