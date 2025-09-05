package com.projects.todo_app.domain;

import com.projects.todo_app.data.TaskRepository;
import com.projects.todo_app.models.Status;
import com.projects.todo_app.models.Task;
import jakarta.validation.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

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

    public Result<Task> add(Task task) {
        Result<Task> result = new Result<>();

        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Task>> violations = validator.validate(task);

        if (!violations.isEmpty()) {
            for (ConstraintViolation<Task> violation: violations) {
                result.addErrorMessage(violation.getMessage());
                return result;
            }
        }

        // I can't figure out how to use annotations to configure this piece of validation
        if (!isTitleUnique(task.getTitle())) {
            result.addErrorMessage("Title must be unique");
        }

        result.setPayLoad(repository.add(task));
        return result;

    }

    public boolean update(Task task) {
        return repository.update(task);
    }

    public boolean deleteById(long taskId) {
        return repository.deleteById(taskId);
    }

    // Validation helper functions
    private  boolean isTitleUnique(String title) {
        List<Task> tasks = findAll();
        for (Task task: tasks) {
            if (task.getTitle().equals(title)) {
                return false;
            }
        }
        return true;
    }

}
