import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
