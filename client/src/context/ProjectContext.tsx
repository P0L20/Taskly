import { createContext } from "react";
import { type Project } from "../types/Types";

type ProjectContextTypes = {
  projects: Project[];
  loading: boolean;
  addProject: (task: Project) => Promise<void>;
  updateProject: (params: updateParam) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
};

type updateParam = {
  id: string;
  updates: Project;
};

export const ProjectContext = createContext<ProjectContextTypes | null>(null);
