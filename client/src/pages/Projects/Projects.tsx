import { useState } from "react";
import { useProject } from "../../hooks/useProject";
import { useTasksGroupedByProject } from "../../hooks/useTasks";
import type { Project, Task } from "../../types/Types";
import {
  ChevronDown,
  ChevronUp,
  Ellipsis,
  Clock,
  Circle,
  CheckCircle,
} from "lucide-react";
import "./Project.css";
import AddTask from "./AddTask";
import { EditTaskModal } from "../../components/EditTaskModal";
import { useTaskEdit } from "../../context/TaskEditContext";
import ProjectModal from "./AddProject";

type ProjectGroupedTask = {
  proj: Project;
  tasks: Task[];
  percentDone: number;
};

export default function Projects() {
  const { data: projects, isLoading, isError } = useProject();
  const { data: tasks } = useTasksGroupedByProject();
  const [activeProjs, setActiveProjs] = useState<string[]>([]);
  const { openEdit } = useTaskEdit();

  const handleOpenProject = (id: string) => {
    setActiveProjs((prev) =>
      prev.includes(id)
        ? prev.filter((buttonId) => buttonId !== id)
        : [...prev, id],
    );
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

  console.log(groupedProjectTask);

  return (
    <div className="project-page">
      <div className="top-section">
        <ProjectModal />
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
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </div>
                <div className="percent-wrapper">
                  <div className="percentage">
                    <div
                      className="current"
                      style={{
                        backgroundColor: `${project.proj.color}`,
                        width: `${project.percentDone}%`,
                        height: "100%",
                      }}
                    ></div>
                  </div>
                  <span style={{ color: `${project.proj.color}` }}>
                    {Math.floor(project.percentDone)}%
                  </span>
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
                          <span className="status">
                            {task.status == "done" ? (
                              <CheckCircle size={20} className="done" />
                            ) : task.status == "todo" ? (
                              <Circle size={20} className="todo" />
                            ) : (
                              <Clock size={20} className="in-progress" />
                            )}
                          </span>
                          <p className="title">{task.title}</p>
                        </div>
                        <div className="right-container">
                          <p className={`priority ${task.priority}`}></p>
                          <div className="more-info">
                            <p className="date">{task.dueDate.slice(5, 10)}</p>
                            <Ellipsis
                              onClick={() => openEdit(task._id)}
                              className="ellipsis"
                              size={15}
                            />
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
      <EditTaskModal />
    </div>
  );
}
