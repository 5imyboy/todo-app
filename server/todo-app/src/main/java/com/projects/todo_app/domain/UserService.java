package com.projects.todo_app.domain;

import com.projects.todo_app.data.UserRepository;
import com.projects.todo_app.models.User;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserService {

    private final UserRepository repository;
    private final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    User findByEmail(String email) {
        return repository.findByEmail(email);
    }

    Result<User> add(User user) {
        Result<User> result = new Result<>();

        Validator validator = factory.getValidator();
        Set<ConstraintViolation<User>> violations = validator.validate(user);

        if (!violations.isEmpty()) {
            for (ConstraintViolation<User> violation: violations) {
                result.addErrorMessage(violation.getMessage());
            }
            return result;
        }

        if (!isEmailUnique(user.getEmail())) {
            result.addErrorMessage("Email already exists");
        }

        result.setPayLoad(repository.add(user));
        return result;
    }

    boolean deleteById(int userId) {
        return repository.deleteById(userId);
    }

    private boolean isEmailUnique(String email) {
        User potentialDuplicateUser = repository.findByEmail(email);
        return potentialDuplicateUser == null;

    }
}
