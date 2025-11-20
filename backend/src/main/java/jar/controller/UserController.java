package jar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jar.model.User;
import jar.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/users") // This is the URL address: http://localhost:8080/api/users
@CrossOrigin(origins = "http://localhost:3000") // Allows React to talk to this backend
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. Create a new user (Register)
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}