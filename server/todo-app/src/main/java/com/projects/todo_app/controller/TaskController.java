package com.projects.todo_app.controller;

import com.projects.todo_app.domain.Result;
import com.projects.todo_app.domain.ResultType;
import com.projects.todo_app.domain.TaskService;
import com.projects.todo_app.models.Status;
import com.projects.todo_app.models.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
public class TaskController {

    @Autowired
    TaskService service;

    @GetMapping("/task")
    public ResponseEntity<?> findTasks() {
        List<Task> tasks = service.findAll();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/task/id/{taskId}")
    public ResponseEntity<?> findTaskById(@PathVariable int taskId) {
        Task task = service.findById(taskId);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/task/status/{statusString}")
    public ResponseEntity<?> findTasksByStatus(@PathVariable String statusString) {
        Status status;
        switch (statusString) {
            case "not-started":
                status = Status.NOT_STARTED;
                break;
            case "in-progress":
                status = Status.IN_PROGRESS;
                break;
            case "completed":
                status = Status.COMPLETED;
                break;
            default:
                return new ResponseEntity<>("Invalid Status", HttpStatus.BAD_REQUEST);
        }
        List<Task> tasks = service.findByStatus(status);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/task/add")
    public ResponseEntity<?> addTask(@RequestBody Task task) {
        Result<Task> result = service.add(task);
        if (Objects.requireNonNull(result.getType()) == ResultType.INVALID) {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/task/update/{taskId}")
    public ResponseEntity<?> updateTask(@RequestBody Task task, @PathVariable int taskId) {
        if (task.getTaskId() != taskId) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        Result<Task> result = service.update(task);
        return switch(result.getType()) {
            case INVALID -> new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
            case NOT_FOUND -> new ResponseEntity<>(result.getMessages(), HttpStatus.NOT_FOUND);
            default -> new ResponseEntity<>(HttpStatus.NO_CONTENT);
        };
    }

    @DeleteMapping("/task/delete/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable int taskId) {
        if (!service.deleteById(taskId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
