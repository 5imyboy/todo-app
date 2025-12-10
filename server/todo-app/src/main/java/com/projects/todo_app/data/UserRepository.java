package com.projects.todo_app.data;

import com.projects.todo_app.models.User;

public interface UserRepository {
    User findByEmail(String email);

    User add(User user);

    boolean deleteById(int userId);
}
