package com.projects.todo_app.models;

public enum Status {
    NOT_STARTED(1, "Not Started"),
    IN_PROGRESS(2, "In Progress"),
    COMPLETED(3, "Completed");

    private final int id;
    private final String name;

    Status(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }

    public static Status findByTitle(String title) {
        return switch (title) {
            case "NOT_STARTED" -> Status.values()[0];
            case "IN_PROGRESS" -> Status.values()[1];
            case "COMPLETED" -> Status.values()[2];
            default -> throw new IllegalArgumentException("Invalid Status: " + title);
        };
    }

    public static String titleToString(Status status) {
        return switch (status.id) {
            case 1 -> "NOT_STARTED";
            case 2 -> "IN_PROGRESS";
            case 3 -> "COMPLETED";
            default -> throw new IllegalArgumentException("Status not found");
        };
    }
}
