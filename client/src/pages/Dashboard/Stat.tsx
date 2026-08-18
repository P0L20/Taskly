import { useProject } from "../../hooks/useProject";
import { useTasks } from "../../hooks/useTasks";
import type { Task } from "../../types/Types";

type PropStat = {
  tasksGrouped: {
    todo: Task[];
    "in-progress": Task[];
    done: Task[];
  };
};

export default function Stat({ tasksGrouped }: PropStat) {
  const { data: tasks, isError, isLoading } = useTasks();
  const { data: project } = useProject();
  // console.log(tasksGrouped);
  if (isLoading) return;
  if (isError) return;

  // console.log(tasks);

  const stats = [
    { id: "total", title: "total tasks", num: tasks.length },
    {
      id: "in-progress",
      title: "in progress",
      num: tasksGrouped["in-progress"].length,
    },
    { id: "completed", title: "completed", num: tasksGrouped.done.length },
    { id: "projects", title: "projects", num: project?.length },
  ];

  const percent = `${((tasksGrouped.done.length / tasks.length) * 100).toFixed()}%`;

  // console.log(percent);

  return (
    <div className="statistics-container">
      <div className="stat-wrapper">
        {stats.map((stat) => (
          <div className="stat-list" key={stat.id}>
            <p className="title">{stat.title}</p>
            <h1 className={`stat ${stat.id}`}>{stat.num}</h1>
          </div>
        ))}
      </div>

      <div className="percentage-wrapper">
        <div className="top-section">
          <p style={{ color: "var(--text-primary)" }}>Overall Progress</p>
          <p className="text-percent" style={{ color: "var(--color-primary)" }}>
            {percent}
          </p>
        </div>

        <div className="percent-bg">
          <div
            className="percent-indicator"
            style={{
              background: "var(--color-primary)",
              width: percent,
              borderRadius: "10px",
            }}
          ></div>
        </div>

        <div className="bottom-section">
          <span>
            <i style={{}}></i>
          </span>
        </div>
      </div>
    </div>
  );
}
