import { useState } from "react";
import { googleSansCode } from "./fonts";

const DEFAULT_TASK = {
  taskId: 0,
  title: "",
  description: "",
  status: "NOT_STARTED",
  hours: 0,
  minutes: 0
}

// adds task to backend SQL server
async function addTask(task) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  }
  try {
    const response = await fetch("http://localhost:8080/task/add", init);
    if (response.status !== 201 && response.status !== 400) {
      return Promise.reject(`Unexpected Status Code: ${response.status}`)
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default function newTask(displayNewTask, setDisplayNewTask, tasks, setTasks) {
  let [isTaskSmall, setIsTaskSmall] = useState(true);
  const [task, setTask] = useState(DEFAULT_TASK);
  const [errors, setErrors] = useState([]);

  function toggleSize() {
    const newTask = { ...task }
    if (isTaskSmall) {
      newTask.hours = newTask.minutes;
      newTask.minutes = 0;
    } else {
      newTask.minutes = newTask.hours;
      newTask.hours = 0;
    }
    setIsTaskSmall(!isTaskSmall);
    setTask(newTask);
  }

  const handleChange = (event) => {
    const newTask = { ...task };
    newTask[event.target.name] = event.target.value;
    setTask(newTask);
  }

  const handleCancel = () => {
    setDisplayNewTask(false);
    setErrors([]);
  }

  const handleSubmit = (event) => {
    // prevent default form submit
    event.preventDefault();

    // add task and handle errors and updates
    addTask(task).then((data) => {
      if (data && data.taskId) {
        setTasks([...tasks, task]);
        setDisplayNewTask(false);
        setErrors([]);
      } else {
        setErrors(data);
      }
    });
  }

  return (
    <div className={`bg-neutral-50/25 hover:bg-gray-50/50 m-2 p-2 rounded-xl ${displayNewTask ? "" : "hidden"}`}>

      {errors.length !== 0 && (
        <div className="p-2 mb-2 text-sm text-red-800 rounded-lg bg-red-200/80 dark:bg-gray-800/80 dark:text-red-400" role="alert">
          <span className="font-medium">Errors:</span>
          <ul>
            {errors.map(e => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="title" />
          <div className="m-auto w-6/10 p-2">
            <input
              id="title"
              name="title"
              className="bg-gray-200/50 w-full text-center"
              placeholder="Title:"
              maxLength={100}
              onChange={handleChange}
            />
          </div>
        </fieldset>
        <fieldset>
          <label htmlFor="description" />
          <div className="m-auto w-9/10 p-2">
            <textarea
              id="description"
              name="description"
              className="w-full bg-gray-200/50"
              placeholder="notes:"
              onChange={handleChange}
              maxLength={1024}
              rows="3"
            />
          </div>
        </fieldset>
        <div className="flex flex-row m-auto w-9/10 pl-2 pr-2 pb-2">
          <fieldset>
            <label htmlFor="time" />
            <input
              id="time"
              name={isTaskSmall ? "minutes" : "hours"}
              className="bg-gray-200/50"
              type="number"
              placeholder={isTaskSmall ? "minutes" : "hours"}
              onChange={handleChange}
            />
          </fieldset>
          <fieldset className="pl-2">
            <label htmlFor="size">
              <input
                id="size"
                type="checkbox"
                className="sr-only peer"
                onChange={toggleSize}
              />
              <div className="relative w-11 h-6 bg-gray-200/80 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-30/50 dark:peer-focus:ring-blue-800/50 rounded-full peer dark:bg-gray-700/80 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600/80 peer-checked:bg-blue-600/50 dark:peer-checked:bg-blue-600/50"></div>
            </label>
          </fieldset>
        </div>
        <div className="text-m">
          <div className={`${googleSansCode.className} antialiased`}>
            <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-red-400/75" type="button" onClick={handleCancel}>
              <span className="font-bold">x</span>
            </button>
            <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-green-400/75" type="submit">
              <span className="font-bold">&#10003;</span>
            </button>
          </div>
        </div>
      </form>

    </div>
  );
}