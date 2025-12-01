package jar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // <--- This import is required!
import org.springframework.web.bind.annotation.*;

import jar.model.User;
import jar.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
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

    // 3. Login Endpoint (The missing piece!)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        // DEBUG: Print what we received
        System.out.println("Login attempt for email: " + loginRequest.getEmail());

        // Find the user by email
        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) {
            System.out.println("❌ User NOT found in database.");
            return ResponseEntity.status(401).body("User not found");
        }

        // DEBUG: Check passwords (WARNING: Don't do this in production, but okay for learning)
        System.out.println("✅ User found: " + user.getEmail());
        System.out.println("   DB Password:    " + user.getPassword());
        System.out.println("   Input Password: " + loginRequest.getPassword());

        // Check if user exists AND if the password matches
        if (user.getPassword().equals(loginRequest.getPassword())) {
            System.out.println("✅ Password Matches! Login Success.");
            return ResponseEntity.ok(user); // Success: Return the user
        } else {
            System.out.println("❌ Password Mismatch.");
            return ResponseEntity.status(401).body("Invalid email or password"); // Failure
        }
    }

     // 6. UPDATE USER PROFILE
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(userDetails.getFullName());
        user.setEmail(userDetails.getEmail());
        user.setGender(userDetails.getGender());
        user.setDateOfBirth(userDetails.getDateOfBirth());
        user.setBio(userDetails.getBio()); // Update bio

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }
}