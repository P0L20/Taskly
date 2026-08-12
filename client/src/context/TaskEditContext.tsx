import { createContext, useContext, useState, type ReactNode } from "react";

interface TaskEditContextValue {
  editingId: string | null;
  isOpen: boolean;
  openEdit: (id: string) => void;
  closeEdit: () => void;
}

const TaskEditContext = createContext<TaskEditContextValue | null>(null);

export function TaskEditProvider({ children }: { children: ReactNode }) {
  const [editingId, setEdittingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function openEdit(id: string) {
    setEdittingId(id);
    setIsOpen(true);
    console.log("open mo");
  }

  function closeEdit() {
    setIsOpen(false);
    setEdittingId(null);
  }

  return (
    <TaskEditContext.Provider
      value={{
        editingId,
        isOpen,
        openEdit,
        closeEdit,
      }}
    >
      {children}
    </TaskEditContext.Provider>
  );
}

export function useTaskEdit() {
  const ctx = useContext(TaskEditContext);
  if (!ctx) throw new Error("useTaskEdit must be within a TaskEditProvider");
  return ctx;
}
