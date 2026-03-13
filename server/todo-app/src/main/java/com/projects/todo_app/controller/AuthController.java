package com.projects.todo_app.controller;

import com.projects.todo_app.domain.AuthService;
import com.projects.todo_app.domain.Result;
import com.projects.todo_app.domain.ResultType;
import com.projects.todo_app.domain.UserService;
import com.projects.todo_app.models.JwtResponse;
import com.projects.todo_app.models.User;
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
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        Result<String> result = authService.login(credentials);
        if (result.getType() == ResultType.SUCCESS) {
            User user = userService.findByEmail(credentials.get("email"));
            String token = result.getPayload();
            return new ResponseEntity<>(new JwtResponse(token, user), HttpStatus.OK);
        }

        return new ResponseEntity<>(result.getMessages(), HttpStatus.NOT_FOUND);

    }
}