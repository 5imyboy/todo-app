import { ScrollView } from "react-native";
import TaskCard from "../../components/TaskCard";
import { useTasksByStatus } from "../../hooks/useTasksByStatus";

export default function Not_Started() {
  const { tasks, setTasks } = useTasksByStatus("not-started", "NOT_STARTED");
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
