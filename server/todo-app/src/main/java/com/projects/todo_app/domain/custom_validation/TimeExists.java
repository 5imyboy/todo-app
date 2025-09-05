package com.projects.todo_app.domain.custom_validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TimeExistsValidator.class)
public @interface TimeExists {
    String message();
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
