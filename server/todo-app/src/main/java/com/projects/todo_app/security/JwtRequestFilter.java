package com.projects.todo_app.security;

// imports
import com.projects.todo_app.models.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class JwtRequestFilter extends BasicAuthenticationFilter {

    private final JwtConverter converter;

    public JwtRequestFilter(AuthenticationManager authenticationManager, JwtConverter converter) {
        super(authenticationManager);
        this.converter = converter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {

        String bearerToken = null;

        // Mobile clients send the token as an Authorization: Bearer header.
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            bearerToken = authHeader;
        }

        // Web clients send the token as an HttpOnly cookie.
        if (bearerToken == null && request.getCookies() != null) {
            bearerToken = Arrays.stream(request.getCookies())
                    .filter(c -> c.getName().equals("token"))
                    .findFirst()
                    .map(c -> "Bearer " + c.getValue())
                    .orElse(null);
        }

        if (bearerToken != null) {
            User user = converter.getUserFromToken(bearerToken);
            if (user != null) {
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        user.getEmail(), null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
                SecurityContextHolder.getContext().setAuthentication(token);
            }
        }

        chain.doFilter(request, response);
    }
}