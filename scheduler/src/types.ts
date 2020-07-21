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
  scheduled?: boolean; //// will be replaced by scheduling information
};
