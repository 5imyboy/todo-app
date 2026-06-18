import { ScrollView } from "react-native";
import TaskCard from "../../components/TaskCard";
import { useTasksByStatus } from "../../hooks/useTasksByStatus";

export default function Finished() {
  const { tasks, setTasks } = useTasksByStatus("completed", "COMPLETED");
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
