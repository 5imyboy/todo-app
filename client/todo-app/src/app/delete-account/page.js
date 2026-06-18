'use client';

import Link from "next/link";
import { useState } from "react";

export default function DeleteAccount() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    setForm(prev => ({ ...prev, [event.target.id]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setSuccess(false);

    const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    if (loginResponse.status === 401) {
      setErrors(["Invalid email or password."]);
      return;
    }
    if (!loginResponse.ok) {
      setErrors([`Unexpected error: ${loginResponse.status}`]);
      return;
    }

    const data = await loginResponse.json();
    const userId = data.user?.userId;
    if (!userId) {
      setErrors(["Could not identify account. Please try again."]);
      return;
    }

    const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/delete/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (deleteResponse.status === 204) {
      setSuccess(true);
      setForm({ email: "", password: "" });
      return;
    }
    if (deleteResponse.status === 404) {
      setErrors(["Account not found."]);
      return;
    }
    setErrors([`Unexpected error: ${deleteResponse.status}`]);
  };

  return (
    <main className="container mx-auto max-w-m mt-12">
      <div className="text-center mb-6">
        <h1 className="mb-4">Todo List</h1>
        <h2>Delete Account</h2>
        <p className="text-gray-500 mt-2">
          Enter your credentials to permanently delete your account and all associated data.
          This action cannot be undone.
        </p>
      </div>
      {success && (
        <div className="flex justify-center">
          <div className="bg-green-100 border border-green-400 text-green-700 rounded p-3 mb-6 w-1/3">
            Account and all associated data have been permanently deleted.
          </div>
        </div>
      )}
      {errors.length > 0 && (
        <div className="flex justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 rounded p-3 mb-6 w-1/3">
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
              id="email"
              value={form.email}
              onChange={handleChange}
            />
          </fieldset>
          <fieldset className="mb-4">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              id="password"
              value={form.password}
              onChange={handleChange}
            />
          </fieldset>
          <div className="flex justify-between items-center">
            <Link className="text-blue-600 underline" href={"/"}>
              Back to Login
            </Link>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
            >
              Delete My Account
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}