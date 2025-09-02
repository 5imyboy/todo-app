package com.projects.todo_app.domain;

import com.projects.todo_app.data.TaskRepository;
import com.projects.todo_app.models.Status;
import com.projects.todo_app.models.Task;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> findAll() {
        return repository.findAll();
    }

    public List<Task> findByStatus(Status status) {
        return repository.findByStatus(status);
    }

    public Task findById(int taskId) {
        return repository.findById(taskId);
    }

    public Task add(Task task) {
        return repository.add(task);
    }

    public boolean update(Task task) {
        return repository.update(task);
    }

    public boolean deleteById(long taskId) {
        return repository.deleteById(taskId);
    }

}
