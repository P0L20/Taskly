import { useState } from "react";
import { useProject } from "../../hooks/useProject";
import { useTasksGroupedByProject } from "../../hooks/useTasks";
import type { Project, Task } from "../../types/Types";
import {
  ChevronDown,
  ChevronUp,
  Square,
  CheckSquare,
  Ellipsis,
} from "lucide-react";
import { useUpdateTask } from "../../hooks/useTasks";
import "./Project.css";
import AddTask from "./AddTask";
import { EditTaskModal } from "../../components/EditTaskModal";

type ProjectGroupedTask = {
  proj: Project;
  tasks: Task[];
  percentDone: number;
};

export default function Projects() {
  const { data: projects, isLoading, isError } = useProject();
  const { data: tasks } = useTasksGroupedByProject();
  const [activeProjs, setActiveProjs] = useState<string[]>([]);

  const handleOpenProject = (id: string) => {
    setActiveProjs((prev) =>
      prev.includes(id)
        ? prev.filter((buttonId) => buttonId !== id)
        : [...prev, id],
    );
  };

  const updateTask = useUpdateTask();

  const handleUpdateStatus = (id: string, currentStatus: Task["status"]) => {
    const newStatus = currentStatus === "done" ? "todo" : "done";
    updateTask.mutate({ id, status: newStatus });
  };

  if (isLoading) return null;
  if (isError) return null;
  if (!projects || !tasks) return null;

  const groupedProjectTask: ProjectGroupedTask[] = projects.map(
    (proj: Project) => {
      const projectTasks = tasks[proj._id] ?? [];
      const doneCount = projectTasks.filter((t) => t.status === "done").length;
      return {
        proj,
        tasks: projectTasks,
        percentDone:
          projectTasks.length === 0
            ? 0
            : (doneCount / projectTasks.length) * 100,
      };
    },
  );

  return (
    <>
      <div className="top-section">
        <button>Add new project</button>
      </div>
      <ul className="project-list">
        {groupedProjectTask.map((project) => (
          <li key={project.proj._id} className="project-container">
            <div className="project-wrapper">
              <div
                className="top-section"
                onClick={() => handleOpenProject(project.proj._id)}
              >
                <div className="top-wrapper">
                  <p className="project-name">{project.proj.name}</p>
                  {activeProjs.includes(project.proj._id) ? (
                    <ChevronDown />
                  ) : (
                    <ChevronUp />
                  )}
                </div>
                <div className="percent-wrapper">
                  <div className="percentage">
                    <div
                      className="current"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        width: `${project.percentDone}%`,
                        height: "100%",
                      }}
                    ></div>
                  </div>
                  <span>{Math.floor(project.percentDone)}%</span>
                </div>
              </div>

              <div className="bottom-section">
                {activeProjs.includes(project.proj._id) && (
                  <ul className="tasks-project">
                    <div className="top-container">
                      <p>TASKS</p>
                      <AddTask project={project.proj} />
                    </div>
                    {project.tasks.map((task) => (
                      <li key={task._id} className="task">
                        <div className="left-container">
                          <span
                            className="update-status"
                            onClick={() =>
                              handleUpdateStatus(task._id, task.status)
                            }
                          >
                            {task.status == "done" ? (
                              <CheckSquare color="var(--color-primary)" />
                            ) : (
                              <Square />
                            )}
                          </span>
                          <p className="title">{task.title}</p>
                        </div>
                        <div className="right-container">
                          <p className={`priority ${task.priority}`}></p>
                          <div className="more-info">
                            <p className="date">{task.dueDate.slice(5, 10)}</p>
                            <Ellipsis className="ellipsis" size={15} />
                            <EditTaskModal />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
