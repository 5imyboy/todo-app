package com.projects.todo_app.domain;

import com.projects.todo_app.data.UserRepository;
import com.projects.todo_app.models.User;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();

    public UserService(UserRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException(String.format("No user exists with email %s", email));
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }

    public User findByEmail(String email) {
        return repository.findByEmail(email);
    }

    public Result<User> add(User user) {
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

        user.setPassword(encoder.encode(user.getPassword()));
        result.setPayLoad(repository.add(user));
        return result;
    }

    public boolean deleteById(int userId) {
        return repository.deleteById(userId);
    }

    private boolean isEmailUnique(String email) {
        User potentialDuplicateUser = repository.findByEmail(email);
        return potentialDuplicateUser == null;

    }
}
