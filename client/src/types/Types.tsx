export type Task = {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: string;
  status: string;
  projectId: string;
};

export type Project = {
  _id: string;
  name: string;
  description?: string;
  status: string;
  color: string;
};
