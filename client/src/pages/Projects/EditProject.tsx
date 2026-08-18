import { Ellipsis } from "lucide-react";
import Modal from "../../components/Modal";
import { useUpdateProject } from "../../hooks/useProject";
import { useState } from "react";
import type { Project, Task } from "../../types/Types";
import Popover from "./Popover";

const HEX_COLOR = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

type EditProps = {
  project: Project;
  tasks: Task[];
};

export default function EditProject({ project, tasks }: EditProps) {
  const { mutate: updateProject, isPending, error } = useUpdateProject();
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(project.color);

  const colorIsValid = HEX_COLOR.test(color);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProject(
      {
        id: project._id,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        color: formData.get("color") as string,
      },
      {
        onSuccess: () => setIsOpen(false),
      },
    );
  }

  return (
    <>
      <Ellipsis size={15} onClick={() => setIsOpen(true)} />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Project"
        key={project._id}
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={project.name}
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
              defaultValue={project.description}
              disabled={isPending}
            />
          </div>

          <div className="form-group">
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

          {error && (
            <p
              style={{
                color: "var(--color-error)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              {error.message || "Failed to update project"}
            </p>
          )}

          <div className="modal-actions">
            <span>
              <Popover project={project} tasks={tasks} />
            </span>
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
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
