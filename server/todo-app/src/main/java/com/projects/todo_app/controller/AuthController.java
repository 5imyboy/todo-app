package com.projects.todo_app.controller;

import com.projects.todo_app.domain.AuthService;
import com.projects.todo_app.domain.Result;
import com.projects.todo_app.domain.ResultType;
import com.projects.todo_app.domain.UserService;
import com.projects.todo_app.models.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Objects;

@RestController
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
        Result<String> result = authService.login(credentials);
        if (result.getType() == ResultType.SUCCESS) {
            User user = userService.findByEmail(credentials.get("email"));

            Cookie tokenCookie = new Cookie("token", result.getPayload());
            tokenCookie.setHttpOnly(true);
            tokenCookie.setPath("/");
            response.addCookie(tokenCookie);

            Cookie emailCookie = new Cookie("user_email", user.getEmail());
            emailCookie.setHttpOnly(true);
            emailCookie.setPath("/");
            response.addCookie(emailCookie);

            return new ResponseEntity<>(user, HttpStatus.OK);
        }

        return new ResponseEntity<>(result.getMessages(), HttpStatus.NOT_FOUND);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        Result<User> result = userService.add(user);
        if (Objects.requireNonNull(result.getType()) == ResultType.INVALID) {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }
}