package com.projects.todo_app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projects.todo_app.data.UserRepository;
import com.projects.todo_app.models.User;
import com.projects.todo_app.security.JwtConverter;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc // 2. Configure the mock MVC environment.
class UserControllerTest {

    @Mock
    UserRepository repository;

    @Autowired
    MockMvc mvc;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    JwtConverter jwtConverter;

    private static boolean hasSetUp = false;
    private String token;

    private final List<User> USERS = List.of(
            new User(1, "testOne@email.com", "hash1234"),
            new User(2, "testTwo@email.com", "hash5678")
    );

    @BeforeEach
    void setup() {
        if (!hasSetUp) {
            hasSetUp = true;
            jdbcTemplate.update("call set_good_known_state();");
        }
        token = jwtConverter.getTokenFromUser(new User(USERS.get(0).getEmail()));
    }

    @Test
    void shouldFindByEmail() throws Exception {
        User user = USERS.get(0);

        ObjectMapper jsonMapper = new ObjectMapper();
        String expectedJson = jsonMapper.writeValueAsString(user);

        mvc.perform(get("/api/user/" + user.getEmail())
                        .cookie(new Cookie("token", token)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldNotFindMissingEmail() throws Exception {
        mvc.perform(get("/api/user/null@null.com")
                        .cookie(new Cookie("token", token)))
                .andExpect(status().isNotFound());
    }
}