export default function Task(task) {
  return (
    <div className="bg-neutral-50/25 hover:bg-neutral-50/50 m-2 p-2 rounded-xl" key={task.taskId}>
      <h3 className="text-center text-xl">{task.title}</h3>
      <p className="text-m">Notes: {task.description}</p>

      <p>Time: {task.hours !== 0 ? task.hours + " hours" : task.minutes + " minutes"}</p>
    </div>
  );
}