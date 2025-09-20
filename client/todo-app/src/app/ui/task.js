import { googleSansCode } from "./fonts";

export default function Task(task) {
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
          <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-red-400/75">
            <span className="font-bold">x</span>
          </button>
        </div>

      </div>
    </div>
  );
}