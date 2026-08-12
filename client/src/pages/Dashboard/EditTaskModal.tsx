import Modal from "../../components/Modal";
import { useTaskEdit } from "../../context/TaskEditContext";
import { useProject } from "../../hooks/useProject";
import { useUpdateTask } from "../../hooks/useTasks";
import type { Project, Task } from "../../types/Types";
import { useQueryClient } from "@tanstack/react-query";

export function EditTaskModal() {
  const { editingId, isOpen, closeEdit } = useTaskEdit();
  const { data: projects } = useProject();
  const updateTask = useUpdateTask();
  const queryClient = useQueryClient();

  type ProjectChoices = {
    projId: string;
    projName: string;
  };
  const projectChoices = projects?.map((project: Project) => {
    return { projId: project._id, projName: project.name };
  });

  const task = editingId
    ? queryClient
        .getQueryData<Task[]>(["tasks"])
        ?.find((t) => t._id === editingId)
    : undefined;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingId) return;
    const formData = new FormData(e.currentTarget);
    updateTask.mutate(
      {
        id: editingId,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        dueDate: formData.get("dueDate") as string,
        priority: formData.get("priority") as Task["priority"],
        projectId: formData.get("projectId") as string,
      },
      { onSuccess: closeEdit },
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeEdit}
      title="Edit Task"
      key={editingId}
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={task?.title}
            required
            autoFocus
            disabled={updateTask.isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={task?.description}
            disabled={updateTask.isPending}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              defaultValue={task?.dueDate?.slice(0, 10)}
              required
              disabled={updateTask.isPending}
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              defaultValue={task?.priority ?? "medium"}
              disabled={updateTask.isPending}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="projectId">Project Name</label>
          <select
            id="projectId"
            name="projectId"
            defaultValue={task?.projectId ?? ""}
            disabled={updateTask.isPending}
          >
            <option value="">None</option>
            {projectChoices?.map((proj: ProjectChoices) => (
              <option key={proj.projId} value={proj.projId}>
                {proj.projName}
              </option>
            ))}
          </select>
        </div>

        {updateTask.isError && (
          <p
            style={{
              color: "var(--color-error)",
              fontSize: "var(--font-size-xs)",
            }}
          >
            {updateTask.error?.message || "Failed to update task"}
          </p>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={closeEdit}
            disabled={updateTask.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={updateTask.isPending}
          >
            {updateTask.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
