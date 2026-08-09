import { useProject } from "../../hooks/useProject";
import { useTasksGroupedByProject } from "../../hooks/useTasks";
import type { Project } from "../../types/Types";

export default function Projects() {
  const { data: projects, isLoading, isError } = useProject();
  const { data: tasks } = useTasksGroupedByProject();

  if (isLoading) return;
  if (isError) return;
  console.log(tasks);

  return (
    <>
      {projects.map((project: Project) => (
        <p>{project._id}</p>
      ))}
    </>
  );
}
