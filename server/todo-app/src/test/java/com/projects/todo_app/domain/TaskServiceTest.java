package com.projects.todo_app.domain;

import com.projects.todo_app.data.TaskRepository;
import com.projects.todo_app.models.Status;
import com.projects.todo_app.models.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class TaskServiceTest {

    @Mock
    TaskRepository repository;

    @Autowired
    TaskService service;

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
    void shouldAddUnique() {
        Task newTaskIn = new Task(0, 1, "Make Lunch", "", Status.NOT_STARTED, 0, 20);
        Task newTaskOut = new Task(SIZE+1, 1, "Make Lunch", "", Status.NOT_STARTED, 0, 20);
        when(repository.add(newTaskIn)).thenReturn(newTaskOut);

        Result<Task> actual = service.add(newTaskIn);
        assertEquals(ResultType.SUCCESS, actual.getType());
        assertEquals(actual.getPayload(), newTaskOut);

        actual = service.add(newTaskIn);
        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldNotAddMissingFields() {
        Task blankTitle = new Task(0, 1, "", "", Status.NOT_STARTED, 0, 20);
        Task nullTitle = new Task(0, 1, null, "", Status.NOT_STARTED, 0, 20);
        Task nullStatus = new Task(0, 1, "Go for a Walk", "", null, 0, 20);

        Result<Task> actual = service.add(blankTitle);
        assertEquals(ResultType.INVALID, actual.getType());

        actual = service.add(nullTitle);
        assertEquals(ResultType.INVALID, actual.getType());

        actual = service.add(nullStatus);
        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldNotAddMissingTime() {
        Task emptyTime = new Task(0, 1, "Go for a Walk", "", Status.NOT_STARTED, 0, 0);
        Result<Task> actual = service.add(emptyTime);

        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldUpdate() {
        Task newTaskIn = new Task(1, 1, "Wash Dishes Again", "", Status.NOT_STARTED, 0, 30);
        Task newTaskOut = new Task(1, 1, "Wash Dishes Again", "", Status.NOT_STARTED, 0, 30);
        when(repository.add(newTaskIn)).thenReturn(newTaskOut);

        Result<Task> actual = service.update(newTaskIn);
        assertEquals(ResultType.SUCCESS, actual.getType());
        assertEquals(actual.getPayload(), newTaskOut);
    }

    @Test
    void shouldNotUpdateMissingFields() {
        Task blankTitle = new Task(1, 1, "", "", Status.NOT_STARTED, 0, 20);
        Task nullTitle = new Task(1, 1, null, "", Status.NOT_STARTED, 0, 20);
        Task nullStatus = new Task(1, 1, "Go for a Walk", "", null, 0, 20);

        Result<Task> actual = service.update(blankTitle);
        assertEquals(ResultType.INVALID, actual.getType());

        actual = service.update(nullTitle);
        assertEquals(ResultType.INVALID, actual.getType());

        actual = service.update(nullStatus);
        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldNotUpdateMissingTime() {
        Task emptyTime = new Task(1, 1, "Go for a Walk", "", Status.NOT_STARTED, 0, 0);
        Result<Task> actual = service.update(emptyTime);

        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldNotUpdateMissingId() {
        Task missing = new Task(99, 1, "Missing Task", "", Status.NOT_STARTED, 0, 30);
        Result<Task> actual = service.update(missing);
        assertEquals(ResultType.NOT_FOUND, actual.getType());
    }

}