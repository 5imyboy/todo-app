package com.projects.todo_app.data;

import com.projects.todo_app.models.Status;
import com.projects.todo_app.models.Task;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.util.List;

@Repository
public class TaskJdbcTemplateRepository implements TaskRepository {
    private final JdbcTemplate jdbcTemplate;

    public TaskJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Task> mapper = (ResultSet resultSet, int rowNum) -> {
        return new Task(
                resultSet.getInt("task_id"),
                resultSet.getString("title"),
                resultSet.getString("description"),
                Status.findByTitle(resultSet.getString("status")),
                resultSet.getInt("hours"),
                resultSet.getInt("minutes")
        );
    };

    @Override
    public List<Task> findAll() {
        final String sql = "select task_id, title, description, status, hours, minutes from task";
        return jdbcTemplate.query(sql, mapper);
    }

    @Override
    public List<Task> findByStatus(Status status) {
        final String sql = "select task_id, title, description, status, hours, minutes from task where status = ?";
        try {
            return jdbcTemplate.query(sql, mapper, Status.titleToString(status));
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    @Override
    public Task findById(int taskId) {
        final String sql = "select task_id, title, description, status, hours, minutes from task where task_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, mapper, taskId);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    @Override
    public Task add() {
        return null;
    }

    @Override
    public boolean update(Task task) {
        return false;
    }

    @Override
    public boolean deleteById(long taskId) {
        return false;
    }
}
