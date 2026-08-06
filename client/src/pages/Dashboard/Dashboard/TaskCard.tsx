import type { JSX } from "react";
import type { Task } from "../../../types/Types";
import { Ellipsis } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps): JSX.Element => {
  const date = new Date(task.dueDate);
  const formattedDate = date.toLocaleDateString();
  // console.log(formattedDate);

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
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      className="taskcard-container"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="wrapper">
        <Ellipsis size={20} />
        <div className="upper-section">
          <div className="name">{task.title}</div>
          <div className="description">{task.description}</div>
        </div>
        <div className="bottom-section">
          <p className="due">{formattedDate}</p>
          <span className={task.priority}>{task.priority}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
