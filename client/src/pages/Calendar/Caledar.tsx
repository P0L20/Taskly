import { useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type Event,
  type View,
} from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import { useTasks } from "../../hooks/useTasks";
import type { Task } from "../../types/Types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import SelectedTask from "./SelectedTask";
import { useSettings } from "../../context/SettingsContext";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const settingsDefault = JSON.parse(
  localStorage.getItem("task-planner-settings") || "month",
);

const calendarView = settingsDefault.defaultCalendarView || "month";

console.log(calendarView);

interface TaskEvent extends Event {
  resource: Task;
}

const PRIORITY_COLORS: Record<Task["priority"], string> = {
  low: "#4b5563",
  medium: "#d97706",
  high: "#dc2626",
};

export default function CalendarPage() {
  const { data: tasks, isLoading, isError } = useTasks();
  const { defaultCalendarView } = useSettings();
  const [view, setView] = useState<View>(defaultCalendarView);
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(new Date(start));
  };

  const selectedTasks = useMemo(() => {
    if (!selectedDate || !tasks) return null;
    return tasks.filter((task: Task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === selectedDate.getFullYear() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getDate() === selectedDate.getDate()
      );
    });
  }, [tasks, selectedDate]);

  const events: TaskEvent[] = useMemo(() => {
    if (!tasks) return [];
    return tasks
      .filter((t: Task) => t.dueDate)
      .map((t: Task) => {
        const due = new Date(t.dueDate);
        return {
          title: t.title,
          start: due,
          end: due,
          allDay: true,
          resource: t,
        };
      });
  }, [tasks]);

  if (isLoading) return <p className="state-text">Loading calendar…</p>;
  if (isError)
    return <p className="state-text state-error">Couldn't load tasks.</p>;

  const eventPropGetter = (event: TaskEvent) => {
    const isDone = event.resource.status === "done";
    return {
      style: {
        backgroundColor: isDone
          ? "#166534"
          : PRIORITY_COLORS[event.resource.priority],
        opacity: isDone ? 0.5 : 1,
        border: "none",
        borderRadius: "4px",
      },
    };
  };

  return (
    <div className="main-wrapper">
      <div className="page-desc">
        <h1>Calendar</h1>
        <p className="intro">Everything with a due date, laid out by day.</p>
      </div>

      <div className="calendar-legend">
        <span>
          <i style={{ background: PRIORITY_COLORS.low }} /> Low
        </span>
        <span>
          <i style={{ background: PRIORITY_COLORS.medium }} /> Medium
        </span>
        <span>
          <i style={{ background: PRIORITY_COLORS.high }} /> High
        </span>
        <span>
          <i style={{ background: "#166534" }} /> Done
        </span>
      </div>

      <div className="calendar-layout">
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            eventPropGetter={eventPropGetter}
            views={["month", "week", "agenda"]}
            selectable="ignoreEvents"
            onSelectSlot={handleSelectSlot}
            style={{ height: 750 }}
            dayPropGetter={(date) => {
              if (
                selectedDate &&
                date.toDateString() === selectedDate.toDateString()
              ) {
                return {
                  className: "selected-date",
                };
              }

              return {};
            }}
          />
        </div>

        {
          <SelectedTask
            selectedTasks={selectedTasks}
            selectedDate={selectedDate}
          />
        }
      </div>

      {/* {selectedTask && (
        <div
          className="task-popover-backdrop"
          onClick={() => setSelectedTask(null)}
        >
          <div className="task-popover" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedTask.title}</h3>
            {selectedTask.description && <p>{selectedTask.description}</p>}
            <div className="task-popover-meta">
              <span>{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
              <span className={selectedTask.priority}>
                {selectedTask.priority}
              </span>
            </div>
            <button
              className="btn-secondary"
              onClick={() => setSelectedTask(null)}
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}
