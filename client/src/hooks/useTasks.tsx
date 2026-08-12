import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../types/Types";

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("http://localhost:3000/api/tasks");
  if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.status}`);
  return res.json();
}

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

export function useTasksGroupedByStatus() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    select: (tasks: Task[]) => ({
      todo: tasks.filter((t) => t.status === "todo"),
      "in-progress": tasks.filter((t) => t.status === "in-progress"),
      done: tasks.filter((t) => t.status === "done"),
    }),
  });
}

export function useTasksGroupedByProject() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    select: (tasks: Task[]) =>
      tasks.reduce<Record<string, Task[]>>((acc, t) => {
        const key = t.projectId ?? "unassigned";
        (acc[key] ??= []).push(t);
        return acc;
      }, {}),
  });
}

export function useProjectTasks() {
  return useQuery({
    queryKey: ["tasks", "grouped", "project"],
    queryFn: () => fetch,
  });
}

export type Priority = "low" | "medium" | "high";

export type TaskInput = {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority | string;
  projectId: string | null;
};

export function useAddTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task) =>
      fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      }).then((res) => {
        if (!res.ok) throw new Error(`Failed to add task: ${res.status}`);
        return res.json();
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export type TaskUpdate = Partial<TaskInput> & { status?: Task["status"] };

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<
    Task,
    Error,
    { id: string } & TaskUpdate,
    { previousTasks?: Task[]; previousGrouped?: TaskGroups }
  >({
    mutationFn: ({ id, ...updates }) =>
      fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }).then((res) => {
        if (!res.ok) throw new Error(`Failed to update task: ${res.status}`);
        return res.json();
      }),

    onMutate: async ({ id, ...updates }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      const previousGrouped = queryClient.getQueryData<TaskGroups>([
        "tasks",
        "grouped",
      ]);

      // optimistically update the flat list
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(["tasks"], (old) =>
          old?.map((t) => (t._id === id ? { ...t, ...updates } : t)),
        );
      }

      // optimistically update the grouped view (what the Dashboard board reads)
      if (previousGrouped) {
        queryClient.setQueryData<TaskGroups>(["tasks", "grouped"], (old) => {
          if (!old) return old;
          const next: TaskGroups = { todo: [], "in-progress": [], done: [] };
          for (const key of Object.keys(old) as (keyof TaskGroups)[]) {
            next[key] = old[key].filter((t) => t._id !== id);
          }
          const moved = Object.values(old)
            .flat()
            .find((t) => t._id === id);
          if (moved) {
            const updated = { ...moved, ...updates };
            next[updated.status as keyof TaskGroups].push(updated);
          }
          return next;
        });
      }

      return { previousTasks, previousGrouped };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTasks)
        queryClient.setQueryData(["tasks"], context.previousTasks);
      if (context?.previousGrouped)
        queryClient.setQueryData(["tasks", "grouped"], context.previousGrouped);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
