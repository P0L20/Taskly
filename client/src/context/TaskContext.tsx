import { createContext } from "react";
import type { Task } from "../types/Types";

type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Task) => Promise<void>;
  updateTask: (params: updateParam) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

type updateParam = {
  id: string;
  updates: Task;
};

export const TaskContext = createContext<TaskContextType | null>(null);
