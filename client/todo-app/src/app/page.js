'use client';

import { useEffect, useState } from "react";
import Task from "@/app/ui/task";

async function loadTasks(url) {
  const init = {
    method: "GET",
  };
  try {
    const response = await fetch(`${url}`, init);
    if (!(response.status === 200 || response.status === 400)) {
      return Promise.reject(`Unexpected Status Code: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

function handleAdd() {
  console.log("add task");
}

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const url = "http://localhost:8080/task";

  useEffect(() => {
    loadTasks(url).then(setTasks);
  }, []);

  return (
    <div className="grid grid-rows-12 font-sans items-center justify-items-center h-screen p-8 pb-20 gap-4 sm:p-10">
      <h1 className="row-span-1 text-4xl text-center p-4">
        Todo List
      </h1>
      <div className="row-span-1 w-8/10 grid grid-cols-3 gap-[32px] text-center text-xl">
        <h2 className="p-2">Not Started</h2>
        <h2 className="p-2">In Progress</h2>
        <h2 className="p-2">Completed</h2>
      </div>
      <main className="row-span-10 h-full w-8/10 grid grid-cols-3 flex flex-row gap-[32px] items-center rounded">
        <div className="bg-sky-400 h-full col-span-1 rounded-2xl">
          {tasks.map(t => t.status === 'NOT_STARTED' ? Task(t) : "")}
        </div>
        <div className="bg-sky-300 h-full col-span-1 rounded-2xl">
          {tasks.map(t => t.status === 'IN_PROGRESS' ? Task(t) : "")}
        </div>
        <div className="bg-sky-200 h-full col-span-1 rounded-2xl">
          {tasks.map(t => t.status === 'COMPLETED' ? Task(t) : "")}
        </div>
      </main>
      <footer className="p-2 absolute right-px bottom-px pr-6 pb-6">
        <button className="border border-cyan-600 pl-4 pr-4 pb-1 text-6xl rounded-4xl text-white bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-300 hover:bg-gradient-to-br hover:from-cyan-300 hover:to-cyan-500" onClick={handleAdd}>
          +
        </button>
      </footer>
    </div>
  );
}
