package com.projects.todo_app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projects.todo_app.data.TaskRepository;
import com.projects.todo_app.models.Status;
import com.projects.todo_app.models.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.json.JsonCompareMode;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc // 2. Configure the mock MVC environment.
class TaskControllerTest {

    @Mock
    TaskRepository repository;

    @Autowired
    MockMvc mvc;

    @Autowired
    JdbcTemplate jdbcTemplate;

    private static boolean hasSetUp = false;

    private final List<Task> TASKS = List.of(
            new Task(1, "Clean Room", "Make the bed and vacumm the floor", Status.NOT_STARTED, 2, 0),
            new Task(2, "Brush Teeth", "Brush for at least 3 minutes!", Status.IN_PROGRESS, 0, 10),
            new Task(3, "Wake Up", "", Status.COMPLETED, 0, 5)
    );

    @BeforeEach
    void setup() {
        if (!hasSetUp) {
            hasSetUp = true;
            jdbcTemplate.update("call set_good_known_state();");
        }
    }

    @Test
    void shouldFindTasks() throws Exception {
        List<Task> tasks = TASKS;

        // ObjectMapper is the default JSON serializer for Spring MVC.
        // We use it to generate the expected HTTP response body
        ObjectMapper jsonMapper = new ObjectMapper();
        String expectedJsonPart = jsonMapper.writeValueAsString(TASKS.get(2)); // we will not modify the 3rd element in other tests

        // Configure the per-test behavior for mock PetRepository.
        when(repository.findAll()).thenReturn(tasks);

        mvc.perform(get("/task"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        String result = mvc.perform(get("/task")).andReturn().getResponse().getContentAsString();
        assertTrue(result.contains(expectedJsonPart));
    }

    @Test
    void shouldFindById() throws Exception {
        Task task = TASKS.get(0);

        ObjectMapper jsonMapper = new ObjectMapper();
        String expectedJson = jsonMapper.writeValueAsString(task);

        when(repository.findById(1)).thenReturn(task);

        mvc.perform(get("/task/id/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(expectedJson, JsonCompareMode.LENIENT));
    }

    @Test
    void shouldNotFindMissingId() throws Exception {
        when(repository.findById(999)).thenReturn(null);

        mvc.perform(get("/task/id/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldFindBySection() throws Exception {
        List<Task> completed = List.of(TASKS.get(2));

        ObjectMapper mapper = new ObjectMapper();
        String expectedJson = mapper.writeValueAsString(completed);

        when(repository.findByStatus(Status.COMPLETED)).thenReturn(completed);

        mvc.perform(get("/task/status/completed"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(expectedJson));
    }

    @Test
    void shouldAdd() throws Exception {
        Task newTaskIn = new Task(0, "Make Breakfast", "", Status.NOT_STARTED, 0, 20);
        Task newTaskOut = new Task(4, "Make Breakfast", "", Status.NOT_STARTED, 0, 20);

        ObjectMapper mapper = new ObjectMapper();
        String newTaskJson = mapper.writeValueAsString(newTaskIn);
        String expectedJson = mapper.writeValueAsString(newTaskOut);

        var request = post("/task/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newTaskJson);

        mvc.perform(request)
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(expectedJson));
    }

    @Test
    void shouldNotAddInvalid() throws Exception {
        Task nullTask = null;
        Task blankTitle = new Task(0, "", "", Status.NOT_STARTED, 0, 20);
        Task nullStatus = new Task(0, "Go for a Walk", "", null, 0, 20);
        Task emptyTime = new Task(0, "Go for a Walk", "", Status.NOT_STARTED, 0, 0);

        ObjectMapper mapper = new ObjectMapper();
        String nullTaskJson = mapper.writeValueAsString(nullTask);
        String blankTitleJson = mapper.writeValueAsString(blankTitle);
        String nullStatusJson = mapper.writeValueAsString(nullStatus);
        String emptyTimeJson = mapper.writeValueAsString(emptyTime);

        var request = post("/task/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(nullTaskJson);
        mvc.perform(request).andExpect(status().isBadRequest());

        request = post("/task/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(blankTitleJson);
        mvc.perform(request).andExpect(status().isBadRequest());

        request = post("/task/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(nullStatusJson);
        mvc.perform(request).andExpect(status().isBadRequest());

        request = post("/task/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(emptyTimeJson);
        mvc.perform(request).andExpect(status().isBadRequest());
    }

    @Test
    void shouldUpdate() throws Exception {
        Task newTask = new Task(1, "Wash Dishes", "", Status.NOT_STARTED, 0, 30);

        ObjectMapper mapper = new ObjectMapper();
        String newTaskJson = mapper.writeValueAsString(newTask);

        var request = put("/task/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newTaskJson);

        mvc.perform(request).andExpect(status().isNoContent());
    }

    @Test
    void shouldNotUpdateInvalid() throws Exception {
        Task nullTask = null;
        Task blankTitle = new Task(1, "", "", Status.NOT_STARTED, 0, 30);
        Task nullStatus = new Task(1, "Missing Status", "", null, 0, 30);
        Task emptyTime = new Task(1, "Missing Time", "", Status.NOT_STARTED, 0, 0);
        Task missingId = new Task(99, "Missing Id", "", Status.NOT_STARTED, 0, 30);

        ObjectMapper mapper = new ObjectMapper();
        String nullTaskJson = mapper.writeValueAsString(nullTask);
        String blankTitleJson = mapper.writeValueAsString(blankTitle);
        String nullStatusJson = mapper.writeValueAsString(nullStatus);
        String emptyTimeJson = mapper.writeValueAsString(emptyTime);
        String missingIdJson = mapper.writeValueAsString(missingId);

        var request = put("/task/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(nullTaskJson);
        mvc.perform(request).andExpect(status().isBadRequest());

        request = put("/task/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(blankTitleJson);
        mvc.perform(request).andExpect(status().isBadRequest());

        request = put("/task/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(nullStatusJson);
        mvc.perform(request).andExpect(status().isBadRequest());

        request = put("/task/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(emptyTimeJson);
        mvc.perform(request).andExpect(status().isBadRequest());

        request = put("/task/update/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(missingIdJson);
        mvc.perform(request).andExpect(status().isNotFound());

        request = put("/task/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(missingIdJson);
        mvc.perform(request).andExpect(status().isConflict());
    }

    @Test
    void shouldDelete() throws Exception {
        mvc.perform(delete("/task/delete/2")).andExpect(status().isNoContent());
    }

    @Test
    void shouldNotDeleteMissing() throws Exception {
        mvc.perform(delete("/task/delete/999")).andExpect(status().isNotFound());
    }
}