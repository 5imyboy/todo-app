import { ScrollView } from "react-native";
import TaskCard from "../../components/TaskCard";
import { useTasksByStatus } from "../../hooks/useTasksByStatus";

export default function In_Progress() {
  const { tasks, setTasks } = useTasksByStatus("in-progress", "IN_PROGRESS");
  return (
    <ScrollView>
      {tasks.map(t => (
        <TaskCard
          key={t.taskId}
          task={t}
          onDelete={(id) => setTasks(prev => prev.filter(t => t.taskId !== id))}
          onStatusChange={(updated) => setTasks(prev => prev.filter(t => t.taskId !== updated.taskId))}
        />
      ))}
    </ScrollView>
  );
}
