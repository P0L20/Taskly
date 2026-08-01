import type { JSX } from "react";
import type { Task } from "../../../types/Types";
import { Ellipsis } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps): JSX.Element => {
  const date = new Date(task.dueDate);
  const formattedDate = date.toLocaleDateString();
  console.log(formattedDate);
  return (
    <div className="taskcard-container">
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
