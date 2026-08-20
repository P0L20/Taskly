import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../types/Types";

const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

export function useProject() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () =>
      fetch(`${frontendUrl}/api/projects`).then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
        return res.json();
      }),
  });
}

interface NewProject {
  name: string;
  description?: string;
  color: string;
}

interface NewTask {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Task["priority"];
}

export function useAddProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: NewProject) => {
      const res = await fetch(`${frontendUrl}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error(`Failed to create project: ${res.status}`);
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useAddProjectAndTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      project,
      tasks,
    }: {
      project: NewProject;
      tasks: NewTask[];
    }) => {
      const projectRes = await fetch(`${frontendUrl}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!projectRes.ok) {
        throw new Error(`Failed to create project: ${projectRes.status}`);
      }
      const newProject = await projectRes.json();

      const taskResults = await Promise.all(
        tasks.map((task) =>
          fetch(`${frontendUrl}/api/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...task, projectId: newProject._id }),
          }),
        ),
      );

      const failedTask = taskResults.find((res) => !res.ok);
      if (failedTask) {
        throw new Error(
          `Project created, but a task failed to save: ${failedTask.status}`,
        );
      }

      return newProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      name?: string;
      description?: string;
      color?: string;
    }) => {
      const res = await fetch(`${frontendUrl}/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`Failed to update project: ${res.status}`);
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${frontendUrl}/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete project: ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteProjectAndTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${frontendUrl}/api/projects/${id}/cascade`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete project: ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
