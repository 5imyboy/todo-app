'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [user, setUser] = useState({});
  const { username } = useParams();
  const [errors, setErrors] = useState({});
  const url = "http://localhost:8080/api/auth/login";

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
        if (data.token && data.user) {
          // on successful login, put token and user info in session storage
          sessionStorage.setItem("me", data.token);
          sessionStorage.setItem("user_email", data.user.email);
          // force page to reload and get the new session items
          window.location.href = "/tasks";
          
        } else {
          setErrors(data);
        }
      }).catch(console.log);
  }

  return (
    <>
      <section className="container-sm mt-5">
        <div className="text-center mb-4">
          <h1 className="mb-4">Todo List</h1>
          <h2>Login:</h2>
        </div>
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="w-1/2 border border-muted rounded p-4">
            <fieldset className="mb-4">
              <label htmlFor="email">Email address: </label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                onChange={handleChange}
              />
            </fieldset>
            <div className="flex justify-content-between">
              <button
                className="btn btn-dark"
              >
                Login
              </button>
              <Link
                className="btn btn-link flex"
                href={"/tasks"}
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