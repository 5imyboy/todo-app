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

        // 2. Read the token cookie from the request.
        if (request.getCookies() != null) {
            Arrays.stream(request.getCookies())
                    .filter(c -> c.getName().equals("token"))
                    .findFirst()
                    .ifPresent(c -> {
                        // 3. Confirm the token with JwtConverter.
                        User user = converter.getUserFromToken("Bearer " + c.getValue());
                        if (user != null) {
                            // 4. Confirmed. Set auth for this single request.
                            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                                    user.getEmail(), null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
                            SecurityContextHolder.getContext().setAuthentication(token);
                        }
                    });
        }

        // 5. Keep the chain going.
        chain.doFilter(request, response);
    }
}