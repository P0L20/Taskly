import { useDashboardTasks } from "../../../hooks/useTasks";
import TaskCard from "./TaskCard";
import "../../../styles/Dashboard.css";

export default function Dashboard() {
  const { data: tasks, isLoading, isError } = useDashboardTasks();

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Couldn't load tasks.</p>;

  return (
    <>
      <div className="page-desc">
        <h1>Dashboard</h1>
        <p className="intro">Good morning — here's what's happening today.</p>
      </div>
      <div className="tasks-container">
        <div className="todo">
          {tasks?.todo.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
        <div className="in-progress">
          {tasks?.["in-progress"].map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
        <div className="done">
          {tasks?.done.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      </div>
    </>
  );
}
