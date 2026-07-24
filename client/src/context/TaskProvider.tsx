import { type ReactNode, useEffect, useState } from "react";
import { type Task } from "../types/Types";
import { TaskContext } from "./TaskContext";

type ProviderProps = {
  children: ReactNode;
};

export function TaskProvider({ children }: ProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .finally(() => setLoading(false));
  }, []);

  const addTask = async (task: Task) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
  };

  type updateParam = {
    id: string;
    updates: Task;
  };

  const updateTask = async ({ id, updates }: updateParam) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const updatedTask = await res.json();
    setTasks((prev) => prev.map((t) => (t._id === id ? updatedTask : t)));
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loading, addTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}
