import { EditTaskModal } from "../../components/EditTaskModal";
import { useTaskEdit } from "../../context/TaskEditContext";
import type { Task } from "../../types/Types";
import { Ellipsis, CheckCircle, Circle, Clock } from "lucide-react";

type SelectedProps = {
  selectedTasks: Task[] | null;
  selectedDate: Date | null;
};

export default function SelectedTask({
  selectedTasks,
  selectedDate,
}: SelectedProps) {
  const { openEdit } = useTaskEdit();

  const doneCount =
    selectedTasks?.filter((task) => task.status === "done").length ?? 0;

  return (
    <>
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
                  <span className="status">
                    {task.status == "done" ? (
                      <CheckCircle size={20} className="done" />
                    ) : task.status == "todo" ? (
                      <Circle size={20} className="todo" />
                    ) : (
                      <Clock size={20} className="in-progress" />
                    )}
                  </span>
                  <span className="title">{task.title}</span>
                  <span className={`priority ${task.priority}`}></span>
                  <Ellipsis
                    onClick={() => openEdit(task._id)}
                    className="edit-btn"
                  />
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
      <EditTaskModal />
    </>
  );
}
