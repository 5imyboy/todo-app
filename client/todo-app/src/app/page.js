'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [user, setUser] = useState({});
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/login`;

  // update login credentials with form input
  const handleChange = (event) => {
    const newUser = { ...user };
    newUser[event.target.id] = event.target.value;
    setUser(newUser);
  }

  // login user on form submit
  const handleSubmit = (event) => {
    event.preventDefault();

    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user)
    };
    fetch(url, init)
      .then(response => {
        if (response.status === 200 || response.status === 400 || response.status === 404) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Error: ${response.status}`);
        }
      }).then(data => {
        if (data.userId) {
          router.push("/tasks");
        } else {
          setErrors(data);
        }
      }).catch(console.log);
  }

  return (
    <>
      <section className="container mx-auto max-w-m mt-12">
        <div className="text-center mb-6">
          <h1 className="mb-4">Todo List</h1>
          <h2>Login:</h2>
        </div>
        {errors.length > 0 && (
          <div className="flex justify-center">
            <div className="bg-red-100 border border-red-400 text-red-700 rounded p-3 mt-6 mb-6 w-1/3">
              <ul>
                {errors.map(e => <li key={e}>{e}</li>)}
              </ul>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="w-1/2 border border-gray-300 rounded p-4">
            <fieldset className="mb-4">
              <label htmlFor="email">Email address: </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                name="email"
                id="email"
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                name="password"
                id="password"
                onChange={handleChange}
              />
            </fieldset>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Login
              </button>
              <Link
                className="text-blue-600 underline ml-4"
                href={"/register"}
              >
                New User?
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}