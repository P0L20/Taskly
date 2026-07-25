import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/Types";

export default function Dashboard() {
  const { data: tasks, isLoading, isError } = useTasks();

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Couldn't load tasks.</p>;

  return (
    <ul>
      {tasks.map((task: Task) => (
        <li key={task._id}>{task.title}</li>
      ))}
    </ul>
  );
}
