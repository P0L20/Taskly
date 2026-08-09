import { useState } from "react";
import { useProject } from "../../hooks/useProject";
import { useTasksGroupedByProject } from "../../hooks/useTasks";
import type { Project, Task } from "../../types/Types";
import "./Project.css";
import Modal from "../../components/Modal";

export default function Projects() {
  const { data: projects, isLoading, isError } = useProject();
  const { data: tasks } = useTasksGroupedByProject();
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [viewTask, setViewTask] = useState<Task[] | []>([]);

  console.log(tasks);

  const handleCloseTasks = () => {
    setIsOpen(false);
  };

  type Props = {
    id: string;
    name: string;
  };

  const handleOpenTasks = ({ id, name }: Props) => {
    if (!tasks) return;
    setIsOpen(true);
    setModalTitle(name);
    setViewTask(tasks[id]);
    console.log(tasks[id]);
  };

  if (isLoading) return;
  if (isError) return;
  console.log(tasks);

  return (
    <>
      <ul className="project-list">
        {projects.map((project: Project) => (
          <li className="project-container">
            <div className="project-wrapper">
              <div className="top-section">
                <p className="project-name">{project.name}</p>
                <p className="description">{project.description}</p>
              </div>

              <div className="bottom-section">
                <button
                  onClick={() =>
                    handleOpenTasks({
                      id: project._id,
                      name: project.name,
                    })
                  }
                  className="view-tasks"
                >
                  View
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Modal isOpen={isOpen} onClose={handleCloseTasks} title={modalTitle}>
        {viewTask?.map((task) => (
          <p>{task.title}</p>
        ))}
      </Modal>
    </>
  );
}
