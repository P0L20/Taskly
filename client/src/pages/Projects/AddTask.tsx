import { useState } from "react";
import Modal from "../../components/Modal";
import { useAddTask, type TaskInput } from "../../hooks/useTasks";
import { PlusIcon } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export default function AddTask({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: addTask, isPending, isError, error } = useAddTask();
  const { defaultPriority } = useSettings();

  const onClose = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const rawData = Object.fromEntries(formData.entries());

    const data: TaskInput = {
      ...rawData,
      projectId: project._id,
    };

    console.log(data);
    // Trigger mutation to send data to the backend
    addTask(data, {
      onSuccess: () => {
        onClose(); // Only close modal when creation succeeds
      },
    });
  };

  return (
    <>
      <button className="button-add" onClick={() => setIsOpen(!isOpen)}>
        <PlusIcon size={12} />
        <p>Add task</p>
      </button>
      <Modal isOpen={isOpen} onClose={onClose} title="Add task">
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
            <span></span>
            <div className="right-btns">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
