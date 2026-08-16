import type { Task } from "../../types/Types";
import { Plus, Trash2Icon, type LucideIcon } from "lucide-react";
import TaskCard from "./TaskCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import DeleteModal from "../../components/DeleteModal";
import { useState } from "react";
type ColumnProps = {
  name: string;
  tasks: Task[] | [];
  Icon: LucideIcon;
};

export default function TaskColumn({ name, tasks, Icon }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: name,
  });
  const tasksCol = tasks ? tasks : [];
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedTaskDelete, setSelectedTaskDelete] = useState<string[]>([]);

  const handleDeleteTaks = () => {
    const toDelete = tasks.filter((task: Task) => task.status == "done");
    const ids = toDelete.map((task) => task._id);
    setIsOpenDelete(true);
    setSelectedTaskDelete(ids);
  };

  // console.log(tasks);
  return (
    <>
      <div className={`${name} block-task`} ref={setNodeRef}>
        <div className="block-desc">
          <div className="left-section">
            <span className={`icon ${name}`}>{<Icon size={20} />}</span>
            <p className="name">{name}</p>
            <span className={`length ${name}`}>{tasks.length}</span>
          </div>
          <div className="right-section">
            {name !== "done" ? (
              <Plus size={15} />
            ) : (
              <Trash2Icon size={20} onClick={handleDeleteTaks} />
            )}
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
      <DeleteModal
        isOpenDelete={isOpenDelete}
        setIsOpenDelete={setIsOpenDelete}
        selectedTaskDelete={selectedTaskDelete}
      />
    </>
  );
}
