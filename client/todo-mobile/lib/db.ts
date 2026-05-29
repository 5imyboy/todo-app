import * as SQLite from "expo-sqlite";
import { Task } from "../components/TaskCard";

const db = SQLite.openDatabaseSync("tasks.db");

export async function initDB() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      taskId   INTEGER PRIMARY KEY AUTOINCREMENT,
      title    TEXT    NOT NULL,
      description TEXT,
      status   TEXT    NOT NULL,
      hours    INTEGER NOT NULL DEFAULT 0,
      minutes  INTEGER NOT NULL DEFAULT 0
    )
  `);
}

export async function getTasksByStatus(status: string): Promise<Task[]> {
  const rows = await db.getAllAsync<Omit<Task, "userId">>(
    "SELECT * FROM tasks WHERE status = ?", [status]
  );
  return rows.map(row => ({ ...row, userId: 0 }));
}

export async function addTask(task: Omit<Task, "taskId" | "userId">): Promise<Task> {
  const result = await db.runAsync(
    "INSERT INTO tasks (title, description, status, hours, minutes) VALUES (?, ?, ?, ?, ?)",
    [task.title, task.description, task.status, task.hours, task.minutes]
  );
  return { ...task, taskId: result.lastInsertRowId, userId: 0 };
}

export async function updateTask(task: Task): Promise<void> {
  await db.runAsync(
    "UPDATE tasks SET title = ?, description = ?, status = ?, hours = ?, minutes = ? WHERE taskId = ?",
    [task.title, task.description, task.status, task.hours, task.minutes, task.taskId]
  );
}

export async function deleteTask(taskId: number): Promise<void> {
  await db.runAsync("DELETE FROM tasks WHERE taskId = ?", [taskId]);
}
