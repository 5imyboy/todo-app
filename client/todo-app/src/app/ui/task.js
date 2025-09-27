import { googleSansCode } from "./fonts";

async function deleteTask(task) {
  const init = {
    method: "DELETE",
  }
  try {
    const response = await fetch(`http://localhost:8080/task/delete/${task.taskId}`, init);
    if (response.status !== 204) {
      return Promise.reject(`Unexpected Status Code: ${response.status}`);
    }
    return;
  } catch (error) {
    console.error(error);
  }
}

export default function Task(task, tasks, setTasks) {
  // passing by array is by reference, so passing 'tasks' repeatedly should be fine

  const handleDelete = () => {
    deleteTask(task).then(() => {
      setTasks(tasks.filter(t => t.taskId !== task.taskId));
    });
  }

  return (
    <div className="bg-neutral-50/25 hover:bg-gray-50/50 m-2 p-2 rounded-xl" key={task.taskId}>
      <h3 className="text-center text-xl">{task.title}</h3>
      <div className="text-m">
        <p>Notes: {task.description}</p>
        <p>Time: {task.hours !== 0 ? task.hours + " hours" : task.minutes + " minutes"}</p>
        <div className={`${googleSansCode.className} antialiased`}>
          <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-cyan-400">
            <span className="font-bold">&larr;</span>
          </button>
          <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-cyan-400">
            <span className="font-bold">&rarr;</span>
          </button>
          <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-red-400/75" onClick={handleDelete}>
            <span className="font-bold">x</span>
          </button>
        </div>

      </div>
    </div>
  );
}