package com.projects.todo_app.domain.custom_validation;

import com.projects.todo_app.models.Task;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.ValidationException;

import java.lang.reflect.Field;

public class TimeExistsValidator implements ConstraintValidator<TimeExists, Task> {

    @Override
    public void initialize(TimeExists constraintAnnotation) {}

    @Override
    public boolean isValid(Task o, ConstraintValidatorContext context) {
        int hours = o.getHours();
        int minutes = o.getMinutes();
        return hours != 0 || minutes != 0;
    }
}
