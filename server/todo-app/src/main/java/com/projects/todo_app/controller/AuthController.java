package com.projects.todo_app.controller;

import com.projects.todo_app.domain.AuthService;
import com.projects.todo_app.domain.Result;
import com.projects.todo_app.domain.ResultType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        Result<String> result = authService.login(credentials);
        if (result.getType() == ResultType.SUCCESS) {
            return new ResponseEntity<>(Map.of("jwt_token", result.getPayload()), HttpStatus.OK);
        }

        return new ResponseEntity<>(result.getMessages(), HttpStatus.NOT_FOUND);

    }
}