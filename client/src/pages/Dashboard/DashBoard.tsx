import { useTasksGroupedByStatus } from "../../hooks/useTasks";
import "./Dashboard.css";
import { ListTodo, CircleCheckBig, Clock } from "lucide-react";
import TaskColumn from "./TaskColumn";
import {
  DndContext,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { useUpdateTask } from "../../hooks/useTasks";
import { DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { type Task } from "../../types/Types";
import TaskCard from "../Dashboard/TaskCard";

export default function Dashboard() {
  const { data: tasks, isLoading, isError } = useTasksGroupedByStatus();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const allTasks = tasks ? Object.values(tasks).flat() : [];
    const task = allTasks.find((t) => t._id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    console.log("Dragging", active.id, "over", over.id);
  };

  const updateTask = useUpdateTask();

  const resolveTargetStatus = (overId: string): Task["status"] | undefined => {
    const isColumnId = column.some((col) => col.name === overId);
    if (isColumnId) return overId as Task["status"];

    // over.id is a task id — find that task and use its current status
    const allTasks = tasks ? Object.values(tasks).flat() : [];
    return allTasks.find((t) => t._id === overId)?.status;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = resolveTargetStatus(over.id as string);
    const currentStatus = active.data.current?.status;

    if (!newStatus || currentStatus === newStatus) return;

    updateTask.mutate({ id: taskId, status: newStatus });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  // console.log(tasks?.done);

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Couldn't load tasks.</p>;
  if (!tasks) return <p>No tasks found.</p>;

  const column = [
    { name: "todo", icon: ListTodo, tasks: tasks.todo ?? [] },
    { name: "in-progress", icon: Clock, tasks: tasks["in-progress"] ?? [] },
    { name: "done", icon: CircleCheckBig, tasks: tasks.done ?? [] },
  ];

  return (
    <div className="main-wrapper">
      <div className="page-desc">
        <h1>Dashboard</h1>
        <p className="intro">Good morning — here's what's happening today.</p>
      </div>
      <div className="tasks-container">
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          {column.map((col) => (
            <TaskColumn
              key={col.name}
              name={col.name}
              tasks={col.tasks}
              Icon={col.icon}
            />
          ))}
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
