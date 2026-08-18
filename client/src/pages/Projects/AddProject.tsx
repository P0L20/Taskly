import { useState } from "react";
import { Plus } from "lucide-react";
import { useAddProject, useAddProjectAndTasks } from "../../hooks/useProject";
import Modal from "../../components/Modal";
import MultipleAddTask from "./MultipleAddTask";

const HEX_COLOR = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

type TaskRow = {
  id: number;
};

export default function AddProject() {
  const {
    mutate: addProject,
    isPending: isAddingProject,
    error: addProjectError,
  } = useAddProject();
  const {
    mutate: addProjectAndTasks,
    isPending: isAddingProjectAndTasks,
    error: addProjectAndTasksError,
  } = useAddProjectAndTasks();

  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("#6366F1");
  const [tasks, setTasks] = useState<TaskRow[]>([{ id: 1 }]);

  const isPending = isAddingProject || isAddingProjectAndTasks;
  const error = addProjectError || addProjectAndTasksError;
  const colorIsValid = HEX_COLOR.test(color);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const project = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      color: formData.get("color") as string,
    };

    const titles = formData.getAll("task-title") as string[];
    const descriptions = formData.getAll("task-description") as string[];
    const dueDates = formData.getAll("task-dueDate") as string[];
    const priorities = formData.getAll("task-priority") as string[];

    const newTasks = titles
      .map((title, i) => ({
        title,
        description: descriptions[i],
        dueDate: dueDates[i],
        priority: priorities[i] as "low" | "medium" | "high",
      }))
      .filter((task) => task.title.trim() !== "");

    const onSettled = () => {
      setIsOpen(false);
      setColor("#6366F1");
      setTasks([{ id: 1 }]);
      form.reset();
    };

    console.log(newTasks);

    if (newTasks.length > 0) {
      addProjectAndTasks(
        { project, tasks: newTasks },
        { onSuccess: onSettled },
      );
    } else {
      addProject(project, { onSuccess: onSettled });
    }
  }

  return (
    <>
      <button className="new-proj-btn" onClick={() => setIsOpen(true)}>
        <Plus size={15} />
        <p>Add new project</p>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="New Project"
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              maxLength={100}
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
              disabled={isPending}
            />
          </div>

          <div
            className="form-group"
            style={{ borderBottom: "1px solid gray", paddingBottom: "20px" }}
          >
            <label htmlFor="color">Color</label>
            <div className="color-field">
              <input
                className="pick-color"
                type="color"
                aria-label="Pick a color"
                value={colorIsValid ? color : "#6366F1"}
                onChange={(e) => setColor(e.target.value)}
                disabled={isPending}
              />
              <input
                type="text"
                id="color"
                name="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                pattern="^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$"
                required
                disabled={isPending}
              />
            </div>
            {!colorIsValid && (
              <span className="field-hint">
                Enter a valid hex color, e.g. #3B82F6
              </span>
            )}
          </div>

          <div className="form-group">
            <MultipleAddTask tasks={tasks} setTasks={setTasks} />
          </div>

          {error && (
            <p
              style={{
                color: "var(--color-error)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              {error.message || "Failed to create project"}
            </p>
          )}

          <div className="modal-actions">
            <span></span>
            <div className="right-btns">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Create Project"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
