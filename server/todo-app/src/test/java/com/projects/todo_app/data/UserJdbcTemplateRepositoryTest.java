package com.projects.todo_app.data;

import com.projects.todo_app.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class UserJdbcTemplateRepositoryTest {

    @Autowired
    UserJdbcTemplateRepository repository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    boolean hasSetUp = false;

    @BeforeEach
    void setup() {
        if (!hasSetUp) {
            hasSetUp = true;
            jdbcTemplate.update("call set_good_known_state();");
        }
    }

    @Test
    void shouldFindByEmail() {
        User actual = repository.findByEmail("testOne@email.com");
        assertNotNull(actual);
        assertEquals(1, actual.getUserId());
    }

    @Test
    void shouldAdd() {
        User newUser = new User(0, "testNew@testNew.com");
        User actual = repository.add(newUser);

        assertEquals(3, actual.getUserId());
        assertEquals(newUser, actual);
    }

    @Test
    void shouldDelete() {
        assertTrue(repository.deleteById(2));
    }
}