import { useDashboardTasks } from "../../../hooks/useTasks";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import "../../../styles/Dashboard.css";

export default function Dashboard() {
  const { data: tasks, isLoading, isError } = useDashboardTasks();

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Couldn't load tasks.</p>;

  return (
    <div className="main-wrapper">
      <div className="page-desc">
        <h1>Dashboard</h1>
        <p className="intro">Good morning — here's what's happening today.</p>
      </div>
      <div className="tasks-container">
        <div className="todo block-task">
          <div className="block-desc">
            <div className="left-section">
              <p className="name">To-do</p>
              <span>12</span>
            </div>
            <div className="right-section">
              <Plus size={15} />
            </div>
          </div>
          {tasks?.todo.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
        <div className="in-progress block-task">
          <div className="block-desc">
            <div className="left-section">
              <p className="name">In-progress</p>
              <span>8</span>
            </div>
            <div className="right-section">
              <Plus size={15} />
            </div>
          </div>
          {tasks?.["in-progress"].map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
        <div className="done block-task">
          <div className="block-desc">
            <div className="left-section">
              <p className="name">Done</p>
              <span>10</span>
            </div>
            <div className="right-section">
              <Plus size={15} />
            </div>
          </div>
          {tasks?.done.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
