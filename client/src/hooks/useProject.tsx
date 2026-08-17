import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProject() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () =>
      fetch("http://localhost:3000/api/projects").then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
        return res.json();
      }),
  });
}

export function useAddProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (project) =>
      fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      }).then((res) => res.json),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
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
      const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
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
      const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
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
      const res = await fetch(
        `http://localhost:3000/api/projects/${id}/cascade`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(`Failed to delete project: ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
