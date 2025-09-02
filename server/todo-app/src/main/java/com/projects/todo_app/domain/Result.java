package com.projects.todo_app.domain;

import java.util.ArrayList;
import java.util.List;

/*
Make Result type abstract for future scalability
 */
public class Result<T> {
    private final List<String> messages = new ArrayList<>();
    private ResultType type = ResultType.SUCCESS;

    public List<String> getMessages() {
        return messages;
    }

    public ResultType getType() {
        return type;
    }

    private void addMessage(String message, ResultType type) {
        messages.add(message);
        this.type = type;
    }

    private void addErrorMessage(String message) {
        addMessage(message, ResultType.INVALID);
    }
}
