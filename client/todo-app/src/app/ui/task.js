import { useState } from "react";
import { googleSansCode } from "./fonts";
import NewTask from "./newTask";


// CRUD OPERATIONS

async function updateStatus(task) {
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


// MAIN TASK CARD UI

export default function Task({ task, tasks, setTasks }) {
  // passing by array is by reference, so passing 'tasks' repeatedly should be fine

  const [showEdit, setShowEdit] = useState(false);

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  }

  const handleMoveTaskForward = (event) => {
    event.stopPropagation(); // stops button click event from passing to parent div
    handleUpdateStatus(true);
  }

  const handleMoveTaskBackward = (event) => {
    event.stopPropagation();
    handleUpdateStatus(false);
  }

  const handleUpdateStatus = (isForward) => {
    const newTask = task;
    if (isForward && task.status !== "COMPLETED") {
      newTask.status = (task.status === "NOT_STARTED" ? "IN_PROGRESS" : "COMPLETED");
    } else if (!isForward && task.status !== "NOT_STARTED") {
      newTask.status = (task.status === "COMPLETED" ? "IN_PROGRESS" : "NOT_STARTED");
    } else {
      return;
    }

    updateStatus(newTask).then(() => {
      setTasks([...tasks.filter(t => t.taskId !== task.taskId), newTask]);
      task = newTask;
    });
  }

  const handleDelete = (event) => {
    event.stopPropagation();
    deleteTask(task).then(() => {
      setTasks(tasks.filter(t => t.taskId !== task.taskId));
    });
  }

  return (
    <>
      <div className={`${showEdit ? "hidden" : ""} bg-neutral-50/25 hover:bg-gray-50/50 m-2 p-2 rounded-xl`} key={task.taskId} onClick={toggleEdit}>
        <h3 className="text-center text-xl">{task.title}</h3>
        <div className="text-m">
          <p>Notes: {task.description}</p>
          <p>Time: {task.hours !== 0 ? task.hours + " hours" : task.minutes + " minutes"}</p>
          <div className={`${googleSansCode.className} antialiased`}>
            <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-cyan-400" onClick={handleMoveTaskBackward}>
              <span className="font-bold">&larr;</span>
            </button>
            <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-cyan-400" onClick={handleMoveTaskForward}>
              <span className="font-bold">&rarr;</span>
            </button>
            <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-red-400/75" onClick={handleDelete}>
              <span className="font-bold">x</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`${!showEdit ? "hidden" : ""}`}>
        <NewTask displayNewTask={showEdit} setDisplayNewTask={setShowEdit} tasks={tasks} setTasks={setTasks}/>
      </div>
    </>
  );
}