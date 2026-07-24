export type Task = {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: string;
  status: string;
};

export type Project = {
  _id: string;
  title: string;
  descriptoin?: string;
  status: string;
};
