package com.projects.todo_app.data;

import com.projects.todo_app.models.User;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

@Repository
public class UserJdbcTemplateRepository implements UserRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<User> mapper = (ResultSet resultSet, int rowNum) -> {
        return new User(
                resultSet.getInt("user_id"),
                resultSet.getString("email")
        );
    };

    public UserJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public User findByEmail(String email) {
        final String sql = "select user_id, email from `user` where email = ?";
        try {
            return jdbcTemplate.queryForObject(sql, mapper, email);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    @Override
    public User add(User user) {
        final String sql = "insert into `user` (email) values (?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        try {
            int rowsAdded = jdbcTemplate.update((con) -> {
                PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, user.getEmail());
                return ps;
            }, keyHolder);
            if (rowsAdded <= 0 || keyHolder.getKey() == null) {
                return null;
            }
        } catch (DataAccessException ex) {
            return null;
        }
        user.setUserId(keyHolder.getKey().intValue());
        return user;
    }

    @Override
    public boolean deleteById(int userId) {
        final String sql = "delete from `user` where user_id = ?";
        return jdbcTemplate.update(sql, userId) > 0;
    }
}
