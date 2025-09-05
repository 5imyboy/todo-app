package com.projects.todo_app.domain;

import com.projects.todo_app.data.TaskRepository;
import com.projects.todo_app.models.Status;
import com.projects.todo_app.models.Task;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class TaskServiceTest {

    @Mock
    TaskRepository repository;

    @Autowired
    TaskService service;

    @Test
    void shouldAddUnique() {
        Task newTask = new Task(0, "Make Lunch", "", Status.NOT_STARTED, 0, 20);
        Result<Task> actual = service.add(newTask);

        assertEquals(ResultType.SUCCESS, actual.getType());

        actual = service.add(newTask);
        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldNotAddMissingFields() {
        Task blankTitle = new Task(0, "", "", Status.NOT_STARTED, 0, 20);
        Task nullTitle = new Task(0, null, "", Status.NOT_STARTED, 0, 20);
        Task nullStatus = new Task(0, "Go for a Walk", "", null, 0, 20);

        Result<Task> actual = service.add(blankTitle);
        assertEquals(ResultType.INVALID, actual.getType());

        actual = service.add(nullTitle);
        assertEquals(ResultType.INVALID, actual.getType());

        actual = service.add(nullStatus);
        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldNotAddMissingTime() {
        Task emptyTime = new Task(0, "Go for a Walk", "", Status.NOT_STARTED, 0, 0);
        Result<Task> actual = service.add(emptyTime);

        assertEquals(ResultType.INVALID, actual.getType());
    }

}