import type { JSX } from "react";
import type { Task } from "../../types/Types";
import { CircleSmallIcon, Ellipsis } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTaskEdit } from "../../context/TaskEditContext";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps): JSX.Element => {
  const date = new Date(task.dueDate);
  const formattedDate = date.toLocaleDateString();
  // console.log(formattedDate);

  const { openEdit } = useTaskEdit();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    // opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      className={`taskcard-container ${task.status == "done" ? "task-done" : ""}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="wrapper">
        <button
          onClick={() => openEdit(task._id)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Ellipsis size={20} className="edit" />
        </button>
        <div className="upper-section">
          <div className="name">{task.title}</div>
          <div className="description">{task.description}</div>
        </div>
        <div className="bottom-section">
          <p className="due">{formattedDate}</p>
          <span className={`priority ${task.priority}`}>
            {<CircleSmallIcon />}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
