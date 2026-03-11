package com.projects.todo_app.domain;

import com.projects.todo_app.models.User;
import com.projects.todo_app.security.JwtConverter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtConverter converter;

    public AuthService(AuthenticationManager authenticationManager, JwtConverter converter) {
        this.authenticationManager = authenticationManager;
        this.converter = converter;
    }

    public Result<String> login(Map<String, String> credentials) {
        Result<String> result = new Result<>();
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(credentials.get("email"), credentials.get("password"));

        try {
            Authentication authentication = authenticationManager.authenticate(authToken);

            if (authentication.isAuthenticated()) {
                User user = new User(credentials.get("email"));
                result.setPayLoad(converter.getTokenFromUser(user));
                return result;
            }
        } catch (AuthenticationException ex) {
            System.out.println(ex);
        }

        result.addErrorMessage("Invalid credentials");
        return result;
    }
}