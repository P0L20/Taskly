import { useUpdateTask } from "../../hooks/useTasks";
import type { Task } from "../../types/Types";
import { Square, CheckSquare } from "lucide-react";

type SelectedProps = {
  selectedTasks: Task[] | null;
  selectedDate: Date | null;
  setSelectedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

export default function SelectedTask({
  selectedTasks,
  selectedDate,
  setSelectedTasks,
}: SelectedProps) {
  const updateTask = useUpdateTask();

  const handleUpdateStatus = (id: string, status: Task["status"]) => {
    updateTask.mutate({ id, status });

    setSelectedTasks((prev) =>
      prev.map((task) => (task._id === id ? { ...task, status } : task)),
    );
  };

  const doneCount =
    selectedTasks?.filter((task) => task.status === "done").length ?? 0;

  return (
    <aside className="day-panel">
      {selectedDate ? (
        <>
          <div className="day-panel-header">
            <h3>{selectedDate.toLocaleDateString()}</h3>
          </div>
          {selectedTasks?.length === 0 ? (
            <p className="state-text">No tasks for this day.</p>
          ) : (
            selectedTasks?.map((task) => (
              <div key={task._id} className="task-popover-meta">
                <span className="done-btn">
                  {task.status == "done" ? (
                    <CheckSquare
                      size={20}
                      color="var(--color-primary)"
                      onClick={() => handleUpdateStatus(task._id, "todo")}
                    />
                  ) : (
                    <Square
                      size={20}
                      color="gray"
                      onClick={() => handleUpdateStatus(task._id, "done")}
                    />
                  )}
                </span>
                <span className="title">{task.title}</span>
                <span className={task.priority}>{task.priority}</span>
              </div>
            ))
          )}
          <div className="progress">
            <span>
              {doneCount} / {selectedTasks?.length}
            </span>
          </div>
        </>
      ) : (
        <p className="state-text">Click a date to see its tasks.</p>
      )}
    </aside>
  );
}
