import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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
          <div className="top-section">
            <p>What do you want to delete?</p>
            <p className="close-x" onClick={close}>
              x
            </p>
          </div>

          <div className="buttons">
            <button
              type="button"
              className="delete-project"
              disabled={isPending}
              onClick={() =>
                deleteProject.mutate(project._id, { onSuccess: close })
              }
            >
              Delete project ONLY
            </button>
            <button
              type="button"
              className="delete-proj-tasks"
              disabled={isPending}
              onClick={() =>
                deleteProjectAndTasks.mutate(project._id, { onSuccess: close })
              }
            >
              Delete project AND its tasks
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
            <div className="tasks-view">
              <button
                type="button"
                className="dropdown-task-toggle"
                onClick={() => setOpenTask((prev) => !prev)}
              >
                {tasks.length} task{tasks.length === 1 ? "" : "s"}
                {openTask ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openTask && (
                <div className="dropdown-task">
                  {tasks.map((task) => (
                    <p className="task" key={task._id}>
                      {task.title}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
