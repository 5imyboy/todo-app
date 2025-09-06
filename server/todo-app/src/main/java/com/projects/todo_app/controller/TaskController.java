package com.projects.todo_app.controller;

import com.projects.todo_app.domain.Result;
import com.projects.todo_app.domain.ResultType;
import com.projects.todo_app.domain.TaskService;
import com.projects.todo_app.models.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
public class TaskController {

    @Autowired
    TaskService service;

    @GetMapping("/")
    public String Hello() {
        return "Hello World";
    }

    @GetMapping("/task")
    public ResponseEntity<?> findTasks() {
        List<Task> tasks = service.findAll();
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
}
