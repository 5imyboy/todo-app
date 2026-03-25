package com.projects.todo_app.controller;

import com.projects.todo_app.domain.Result;
import com.projects.todo_app.domain.ResultType;
import com.projects.todo_app.domain.UserService;
import com.projects.todo_app.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@CrossOrigin(origins = {"http://localhost:3000"})
@RestController
public class UserController {

    @Autowired
    UserService service;

    @GetMapping("/user/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email) {
        User user = service.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/user/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int userId) {
        if (!service.deleteById(userId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
