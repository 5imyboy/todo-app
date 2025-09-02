package com.projects.todo_app.data;

import com.projects.todo_app.models.Status;
import com.projects.todo_app.models.Task;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
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
        final String sql = "select task_id, title, `description`, `status`, hours, minutes from task";
        return jdbcTemplate.query(sql, mapper);
    }

    @Override
    public List<Task> findByStatus(Status status) {
        final String sql = "select task_id, title, `description`, `status`, hours, minutes from task where status = ?";
        try {
            return jdbcTemplate.query(sql, mapper, Status.titleToString(status));
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    @Override
    public Task findById(int taskId) {
        final String sql = "select task_id, title, `description`, `status`, hours, minutes from task where task_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, mapper, taskId);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    @Override
    public Task add(Task task) {
        final String sql = "insert into task (title, `description`, `status`, hours, minutes) values (?, ?, ?, ?, ?)";

        // preparedStatement: https://docs.spring.io/spring-framework/docs/4.3.x/spring-framework-reference/html/jdbc.html
        KeyHolder keyHolder = new GeneratedKeyHolder();
        try {
            int rowsAdded = jdbcTemplate.update((con) -> {
                PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, task.getTitle());
                ps.setString(2, task.getDescription());
                ps.setString(3, Status.titleToString(task.getStatus()));
                ps.setInt(4, task.getHours());
                ps.setInt(5, task.getMinutes());
                return ps;
            }, keyHolder);
            if (rowsAdded <= 0 || keyHolder.getKey() == null) {
                return null;
            }
        } catch (DataAccessException ex) {
            return null;
        }
        task.setTaskId(keyHolder.getKey().intValue());
        return task;
    }

    @Override
    public boolean update(Task task) {
        final String sql = "update task set " +
                "title = ?, " +
                "`description` = ?, " +
                "`status` = ?, " +
                "hours = ?, " +
                "minutes = ? where task_id = ?";
        int rowsUpdated = jdbcTemplate.update(sql,
                task.getTitle(), task.getDescription(),
                Status.titleToString(task.getStatus()),
                task.getHours(), task.getMinutes(),
                task.getTaskId());
        return rowsUpdated > 0;
    }

    @Override
    public boolean deleteById(long taskId) {
        final String sql = "delete from task where task_id = ?";
        return jdbcTemplate.update(sql, taskId) > 0;
    }
}
