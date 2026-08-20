import { Plus } from "lucide-react";
import Modal from "../../components/Modal";
import { useState } from "react";
import { useAddTask, type TaskInput } from "../../hooks/useTasks";
import { useProject } from "../../hooks/useProject";
import type { Project } from "../../types/Types";
import { useSettings } from "../../context/SettingsContext";

type SpecificProps = {
  status: string;
};

export default function AddSpecificTask({ status }: SpecificProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: addTask, isPending, isError, error } = useAddTask();
  const { defaultPriority } = useSettings();
  const { data: projects } = useProject();

  type ProjectChoices = {
    projId: string;
    projName: string;
  };
  const projectChoices = projects?.map((project: Project) => {
    return { projId: project._id, projName: project.name };
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const rawData = Object.fromEntries(formData.entries());

    const data: TaskInput = {
      ...rawData,
      status,
      projectId: (rawData.projectId as string) || null,
      title: rawData.title as string,
      priority: rawData.priority as string,
    };

    console.log(data);
    addTask(data, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Plus size={15} onClick={() => handleOpen()} />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add task">
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Redesign landing page hero section"
              required
              autoFocus
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Add details about this task..."
              disabled={isPending}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                required
                disabled={isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                defaultValue={defaultPriority}
                disabled={isPending}
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
              defaultValue="medium"
              disabled={isPending}
            >
              <option value="">None</option>
              {projectChoices?.map((proj: ProjectChoices) => (
                <option key={proj.projId} value={proj.projId}>
                  {proj.projName}
                </option>
              ))}
            </select>
          </div>

          {isError && (
            <p
              style={{
                color: "var(--color-error)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              {error?.message || "Failed to add task"}
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
