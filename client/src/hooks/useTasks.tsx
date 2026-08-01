import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../types/Types";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () =>
      fetch("http://localhost:3000/api/tasks").then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.status}`);
        return res.json();
      }),
  });
}

type TaskGroups = {
  todo: Task[];
  "in-progress": Task[];
  done: Task[];
};

export function useDashboardTasks() {
  return useQuery<TaskGroups>({
    queryKey: ["tasks", "grouped"],
    queryFn: () =>
      fetch("http://localhost:3000/api/tasks/groupedTask").then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch grouped tasks: ${res.status}`);
        return res.json() as Promise<TaskGroups>;
      }),
  });
}

export type Priority = "low" | "medium" | "high";

export type TaskInput = {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
};

export function useAddTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task) =>
      fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      }).then((res) => res.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}
