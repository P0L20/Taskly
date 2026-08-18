import { CircleX, PlusIcon } from "lucide-react";
import { useRef } from "react";

type Task = {
  id: number;
};

type MultipleProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

export default function MultipleAddTask({ tasks, setTasks }: MultipleProps) {
  const nextId = useRef(2);

  const handleAddTask = () => {
    setTasks((prev) => [...prev, { id: nextId.current++ }]);
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="add-multiple-task">
      <div className="top-section">
        <h2>Add tasks</h2>
        <PlusIcon onClick={handleAddTask} size={15} />
      </div>

      <div className="tasks-container">
        {tasks.map((task) => (
          <div className="new-task-container form-group" key={task.id}>
            <CircleX onClick={() => handleDeleteTask(task.id)} />
            <div className="form-row">
              <input
                name="task-title"
                type="text"
                required
                placeholder="Task name..."
              />
              <input
                name="task-description"
                type="text"
                placeholder="Task description..."
              />
              <input name="task-dueDate" required type="date" />
              <select
                id="priority"
                required
                name="task-priority"
                defaultValue="medium"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
