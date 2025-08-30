package com.projects.todo_app.data;

import com.projects.todo_app.models.Status;
import com.projects.todo_app.models.Task;

import java.util.List;

public interface TaskRepository {
    List<Task> findAll();

    List<Task> findByStatus(Status status);

    Task findById(int taskId);

    Task add();

    boolean update(Task task);

    boolean deleteById(long taskId);

}
