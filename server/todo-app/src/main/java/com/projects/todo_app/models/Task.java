package com.projects.todo_app.models;

import com.projects.todo_app.domain.custom_validation.TimeExists;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@TimeExists(message = "Time cannot be blank")
public class Task {
    private int taskId;
    @NotBlank(message = "Task title cannot be blank")
    private String title;
    private String description;
    @NotNull(message = "Task status cannot be blank")
    private Status status;
    private int hours;
    private int minutes;

    public Task() {}

    public Task(int taskId, String title, String description, Status status, int hours, int minutes) {
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.hours = hours;
        this.minutes = minutes;
    }

    public int getMinutes() {
        return minutes;
    }

    public void setMinutes(int minutes) {
        this.minutes = minutes;
    }

    public int getHours() {
        return hours;
    }

    public void setHours(int hours) {
        this.hours = hours;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getTaskId() {
        return taskId;
    }

    public void setTaskId(int taskId) {
        this.taskId = taskId;
    }
}
