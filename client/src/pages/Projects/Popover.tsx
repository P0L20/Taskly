import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  useDeleteProject,
  useDeleteProjectAndTasks,
} from "../../hooks/useProject";
import type { Project, Task } from "../../types/Types";

type PopoverType = {
  project: Project;
  tasks: Task[];
};

export default function Popover({ project, tasks }: PopoverType) {
  const [openTask, setOpenTask] = useState(false);
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const deleteProject = useDeleteProject();
  const deleteProjectAndTasks = useDeleteProjectAndTasks();

  const isPending = deleteProject.isPending || deleteProjectAndTasks.isPending;
  const error = deleteProject.error || deleteProjectAndTasks.error;

  function close() {
    setIsOpenPopover(false);
    setOpenTask(false);
  }

  return (
    <>
      <button
        type="button"
        className="btn-delete"
        onClick={() => setIsOpenPopover(true)}
      >
        Delete
      </button>
      {isOpenPopover && (
        <div className="pop-over">
          <p>What do you want to delete?</p>
          <p className="close-x" onClick={close}>
            x
          </p>

          <div className="buttons">
            <button
              type="button"
              className="delete-project"
              disabled={isPending}
              onClick={() =>
                deleteProject.mutate(project._id, { onSuccess: close })
              }
            >
              Delete project only
            </button>
            <button
              type="button"
              className="delete-proj-tasks"
              disabled={isPending}
              onClick={() =>
                deleteProjectAndTasks.mutate(project._id, { onSuccess: close })
              }
            >
              Delete project and its tasks
            </button>
          </div>

          {error && (
            <p
              style={{
                color: "var(--color-error)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              {error.message || "Failed to delete project"}
            </p>
          )}

          <div className="view-proj-task">
            <p>{project.name}</p>
            <button
              type="button"
              className="dropdown-task-toggle"
              onClick={() => setOpenTask((prev) => !prev)}
            >
              {tasks.length} task{tasks.length === 1 ? "" : "s"}
              <ChevronDown size={14} className={openTask ? "open" : ""} />
            </button>
            {openTask && (
              <div className="dropdown-task">
                {tasks.map((task) => (
                  <p key={task._id}>{task.title}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
