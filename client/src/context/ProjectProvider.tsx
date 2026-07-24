import { useEffect, useState, type ReactNode } from "react";
import { ProjectContext } from "./ProjectContext";
import type { Project } from "../types/Types";

type ProviderProps = {
  children: ReactNode;
};

export function ProjectProvider({ children }: ProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .finally(() => setLoading(false));
  }, []);

  const addProject = async (project: Project) => {
    const res = await fetch("/api/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });

    const newProject = await res.json();
    setProjects((prev) => [...prev, newProject]);
  };

  type updateParam = {
    id: string;
    updates: Project;
  };

  const updateProject = async ({ id, updates }: updateParam) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const updatedTask = await res.json();
    setProjects((prev) => prev.map((t) => (t._id === id ? updatedTask : t)));
  };

  const deleteProject = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <ProjectContext.Provider
      value={{ projects, loading, addProject, updateProject, deleteProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
