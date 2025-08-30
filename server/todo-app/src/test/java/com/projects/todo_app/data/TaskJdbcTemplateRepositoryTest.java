package com.projects.todo_app.data;

import com.projects.todo_app.models.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TaskJdbcTemplateRepositoryTest {

    @Autowired
    TaskJdbcTemplateRepository repository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    private static boolean hasSetUp = false;
    private final int SIZE = 3;

    @BeforeEach
    void setup() {
        if (!hasSetUp) {
            hasSetUp = true;
            jdbcTemplate.update("call set_good_known_state();");
        }
    }

    @Test
    void shouldFindAll() {
        List<Task> actual = repository.findAll();
        assertNotNull(actual);
        assertEquals(SIZE, actual.size());

        for (Task task: actual) {
            assertNotEquals(0, task.getTaskId());
            assertNotNull(task.getTitle());
            assertNotNull(task.getStatus());
        }
    }

}