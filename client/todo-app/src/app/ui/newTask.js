import { useState } from "react";
import { googleSansCode } from "./fonts";

export default function newTask(task, hidden) {
  let [isTaskSmall, setIsTaskSmall] = useState(true);

  return (
    <div className="bg-neutral-50/25 hover:bg-gray-50/50 m-2 p-2 rounded-xl">

      <form>
        <fieldset>
          <label htmlFor="title" />
          <div className="m-auto w-6/10 p-2">
            <input
              id="title"
              className="bg-gray-200/50 w-full text-center"
              placeholder="Title:"
            />
          </div>
        </fieldset>
        <fieldset>
          <label htmlFor="description" />
          <div className="m-auto w-9/10 p-2">
            <textarea
              id="description"
              className="w-full bg-gray-200/50"
              placeholder="notes:"
              rows="3"
            />
          </div>
        </fieldset>
        <div className="flex flex-row m-auto w-9/10 pl-2 pr-2 pb-2">
          <fieldset>
            <label htmlFor="time" />
            <input
              id="time"
              className="bg-gray-200/50"
              type="number"
              placeholder={isTaskSmall ? "minutes" : "hours"}
            />
          </fieldset>
          <fieldset className="pl-2">
            <label htmlFor="size">
              <input
                id="size"
                type="checkbox"
                className="sr-only peer"
                onChange={() => setIsTaskSmall(!isTaskSmall)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            </label>
          </fieldset>
        </div>
      </form>

      <div className="text-m">
        <div className={`${googleSansCode.className} antialiased`}>
          <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-red-400/75">
            <span className="font-bold">x</span>
          </button>
          <button className="border pl-2 pr-2 mr-2 rounded-xl hover:bg-green-400/75">
            <span className="font-bold">&#10003;</span>
          </button>
        </div>
      </div>

    </div>
  );
}