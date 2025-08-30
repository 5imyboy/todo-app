package com.projects.todo_app.models;

public class Task {
    private int task_id;
    private String title;
    private String description;
    private Status status;
    private int hours;
    private int minutes;

    public Task(int task_id, String title, String description, Status status, int hours, int minutes) {
        this.task_id = task_id;
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
        return task_id;
    }

    public void setTaskId(int task_id) {
        this.task_id = task_id;
    }
}
