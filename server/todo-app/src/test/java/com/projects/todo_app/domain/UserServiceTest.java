package com.projects.todo_app.domain;

import com.projects.todo_app.data.UserRepository;
import com.projects.todo_app.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class UserServiceTest {

    @Mock
    UserRepository repository;

    @Autowired
    UserService service;

    @Autowired
    JdbcTemplate jdbcTemplate;

    private static boolean hasSetUp = false;
    private final int SIZE = 2;

    @BeforeEach
    void setup() {
        if (!hasSetUp) {
            hasSetUp = true;
            jdbcTemplate.update("call set_good_known_state();");
        }
    }

    @Test
    void shouldAddUnique() {
        User newUserIn = new User(0, "newUser@email.com");
        User newUserOut = new User(SIZE+1, "newUser@email.com");
        when(repository.add(newUserIn)).thenReturn(newUserOut);

        Result<User> actual = service.add(newUserIn);
        assertEquals(ResultType.SUCCESS, actual.getType());
        assertEquals(actual.getPayload().getEmail(), newUserOut.getEmail());

        actual = service.add(newUserOut);
        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldNotAddMissingFields() {
        User blankUser = new User(0, "");
        User nullUser = new User(0, null);

        Result<User> actual = service.add(blankUser);
        assertEquals(ResultType.INVALID, actual.getType());

        actual = service.add(nullUser);
        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldNotAddDuplicateEmail() {
        User blankUser = new User(0, "testOne@email.com");

        Result<User> actual = service.add(blankUser);
        assertEquals(ResultType.INVALID, actual.getType());
    }
}