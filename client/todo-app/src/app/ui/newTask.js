import { useEffect, useState } from "react";
import { googleSansCode } from "./fonts";

const NULL_TASK = {
  taskId: 0,
  title: "",
  description: "",
  status: "NOT_STARTED",
  hours: 0,
  minutes: 0
}


// CRUD OPERATIONS

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

async function updateTask(task) {
  const init = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  }
  try {
    const response = await fetch(`http://localhost:8080/task/update/${task.taskId}`, init);
    if (response.status === 204) {
      return null;
    } else if (response.status !== 400 && response.status !== 404 && response.status !== 409) {
      return Promise.reject(`Unexpected Status Code: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}


// MAIN NEW/EDIT TASK CARD UI

export default function NewTask({ defaultTask, displayNewTask, setDisplayNewTask, tasks, setTasks }) {
  const [isChecked, setIsChecked] = useState(false);
  const [task, setTask] = useState(NULL_TASK);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setTask(defaultTask);
    setIsChecked(defaultTask.hours && defaultTask.hours !== 0);
  }, []);

  const toggleChecked = () => {
    setIsChecked(!isChecked);
    toggleSize(); // for some reason, just having this function in the checkbox does not trigger changes
  }

  const toggleSize = () => {
    const newTask = { ...task }
    if (!isChecked) {
      newTask.hours = newTask.minutes;
      newTask.minutes = 0;
    } else {
      newTask.minutes = newTask.hours;
      newTask.hours = 0;
    }
    setTask(newTask);
  }

  const handleChange = (event) => {
    const newTask = { ...task };
    newTask[event.target.name] = event.target.value;
    setTask(newTask);
  }

  const handleReset = () => {
    setDisplayNewTask(false);
    setIsChecked(false);
    setTask(defaultTask);
    setErrors([]);
  }

  const handleSubmit = (event) => {
    // prevent default form submit
    event.preventDefault();

    if (task.taskId === 0) {
      // add task and handle errors and updates
      addTask(task).then((data) => {
        if (data && data.taskId) {
          setTasks([...tasks, data]);
          handleReset();
        } else {
          setErrors(data);
        }
      });
    } else {
      updateTask(task).then((data) => {
        if (!data) {
          setTasks([...tasks.filter(t => t.taskId !== task.taskId), task]);
          handleReset();
        } else {
          setErrors(data);
        }
      });
    }
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
              value={task.title}
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
              value={task.description}
              maxLength={1024}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </fieldset>
        <div className="flex flex-row m-auto w-9/10 pl-2 pr-2 pb-2">
          <div className="w-1/2">
            <fieldset>
              <label htmlFor="time" />
              <input
                id="time"
                name={!isChecked ? "minutes" : "hours"}
                className="bg-gray-200/50 w-full"
                type="number"
                placeholder={!isChecked ? "minutes" : "hours"}
                value={!isChecked ? task.minutes : task.hours}
                onChange={handleChange}
              />
            </fieldset>
          </div>
          <div className="pl-2 grow">
            <span>{!isChecked ? "minutes" : "hours"}</span>
          </div>
          <fieldset className="pl-2">
            <label htmlFor="size">
              <input
                id="size"
                type="checkbox"
                className="sr-only peer"
                onChange={() => {/* empty function, toggleChecked is run separately */}}
                checked={isChecked}
              />
              <div className="relative w-11 h-6 bg-gray-200/80 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-30/50 dark:peer-focus:ring-blue-800/50 rounded-full peer dark:bg-gray-700/80 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600/80 peer-checked:bg-blue-600/50 dark:peer-checked:bg-blue-600/50" 
                onClick={toggleChecked}>
              </div>
            </label>
          </fieldset>
        </div>
        <div className="text-m">
          <div className={`${googleSansCode.className} antialiased`}>
            <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-red-400/75" type="button" onClick={handleReset}>
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