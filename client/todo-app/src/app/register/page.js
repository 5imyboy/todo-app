'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {

  const [user, setUser] = useState({});
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const url = "http://localhost:8080/register";

  const handleChange = (event) => {
    console.log(user);
    const newUser = { ...user };
    newUser[event.target.id] = event.target.value;
    setUser(newUser);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (user.password !== user.confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }
    delete user.confirmPassword; // backend user object doesn't have this prop

    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    };
    fetch(url, init)
      .then(response => {
        if (response.status === 201 || response.status === 400) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Error: ${response.status}`);
        }
      }).then(data => {
        if (data.userId) {
          router.push("/");
        } else {
          user.confirmPassword = user.password;
          setErrors(data);
        }
      }).catch(console.log);
  }

 return (
    <>
      <section className="container mx-auto max-w-m mt-12">
        <div className="text-center mb-6">
          <h1 className="mb-4">Todo List</h1>
          <h2>Register:</h2>
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
            <fieldset className="mb-4">
              <label htmlFor="confirmPassword">Confirm Password: </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                name="confirmPassword"
                id="confirmPassword"
                onChange={handleChange}
              />
            </fieldset>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Register
              </button>
              <Link
                className="text-blue-600 underline ml-4"
                href={"/"}
              >
                Returning User
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}