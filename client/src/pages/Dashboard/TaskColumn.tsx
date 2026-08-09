import type { Task } from "../../types/Types";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
type ColumnProps = {
  name: string;
  tasks: Task[] | [];
};

export default function TaskColumn({ name, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: name,
  });
  const tasksCol = tasks ? tasks : [];

  // console.log(tasks);
  return (
    <div className={`${name} block-task`} ref={setNodeRef}>
      <div className="block-desc">
        <div className="left-section">
          <p className="name">{name}</p>
          <span>{tasks.length}</span>
        </div>
        <div className="right-section">
          <Plus size={15} />
        </div>
      </div>
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        {tasksCol?.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}
