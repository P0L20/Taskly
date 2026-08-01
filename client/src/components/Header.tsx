import { PlusIcon, SearchIcon, User } from "lucide-react";
import Modal from "./Modal";
import { useState } from "react";
import { useAddTask, type TaskInput } from "../hooks/useTasks";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: addTask, isPending, isError, error } = useAddTask();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as TaskInput;

    // Trigger mutation to send data to the backend
    addTask(data, {
      onSuccess: () => {
        handleClose(); // Only close modal when creation succeeds
      },
    });
  };

  return (
    <div className="header">
      <div className="header-wrapper">
        <div className="left-section">
          <SearchIcon size={15} strokeWidth={2} />
          <input type="text" placeholder="Search tasks..." />
        </div>
        <div className="right-section">
          <div className="add-wrapper">
            <button className="add-btn" onClick={handleOpen}>
              <PlusIcon size={15} strokeWidth={2} />
              <span>New task</span>
            </button>
          </div>
          <div className="profile-wrapper">
            <User size={20} strokeWidth={2} />
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} title="Add new Task">
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
                defaultValue="medium"
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
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
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
    </div>
  );
}
