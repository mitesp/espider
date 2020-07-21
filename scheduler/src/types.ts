export type Class = {
  id: number;
  title: string;
  description: string;
  capacity: number;
  teachers: string[];
  scheduled?: boolean; // will be replaced by scheduling information in Section
};
