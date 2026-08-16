import Modal from "./Modal";
import { useDeleteTasks, useTasks } from "../hooks/useTasks";
import type { Task } from "../types/Types";

interface DeleteProps {
  isOpenDelete: boolean;
  setIsOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTaskDelete: string[];
}

export default function DeleteModal({
  isOpenDelete,
  setIsOpenDelete,
  selectedTaskDelete,
}: DeleteProps) {
  const deleteTasks = useDeleteTasks();
  const { data: tasks } = useTasks();

  const tasksToDelete =
    tasks?.filter((t: Task) => selectedTaskDelete.includes(t._id)) ?? [];

  const handleDelete = () => {
    const ids = tasksToDelete.map((task: Task) => task._id);
    deleteTasks.mutate(ids, {
      onSuccess: () => setIsOpenDelete(false),
    });
  };

  return (
    <Modal isOpen={isOpenDelete} onClose={() => setIsOpenDelete(false)}>
      <div className="delete-modal">
        <div className="top-section">
          <h1>Are you sure you want to delete:</h1>
          <div className="task-list">
            {tasksToDelete.map((task: Task) => (
              <p key={task._id}>{task.title}</p>
            ))}
          </div>
        </div>

        {deleteTasks.isError && (
          <p
            style={{
              color: "var(--color-error)",
              fontSize: "var(--font-size-xs)",
            }}
          >
            {deleteTasks.error?.message || "Failed to delete tasks"}
          </p>
        )}

        <div className="action-btn">
          <button
            className="confirm"
            onClick={handleDelete}
            disabled={deleteTasks.isPending}
          >
            {deleteTasks.isPending ? "Deleting..." : "Yes, delete tasks"}
          </button>
          <button
            className="deny"
            onClick={() => setIsOpenDelete(false)}
            disabled={deleteTasks.isPending}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
