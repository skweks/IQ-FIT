package jar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    // 3. Login Endpoint
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

        // DEBUG: Check passwords
        // System.out.println("   DB Password:    " + user.getPassword()); // Uncomment for debugging
        
        // Check if user exists AND if the password matches
        if (user.getPassword().equals(loginRequest.getPassword())) {
            System.out.println("✅ Password Matches! Login Success.");
            return ResponseEntity.ok(user); // Success: Return the user
        } else {
            System.out.println("❌ Password Mismatch.");
            return ResponseEntity.status(401).body("Invalid email or password"); // Failure
        }
    }

    // 4. DELETE USER (Admin)
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    // 5. SUSPEND USER (Admin)
    @PutMapping("/{id}/suspend")
    public User toggleSuspendUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setSuspended(!user.isSuspended()); 
        return userRepository.save(user);
    }

    // 6. UPDATE USER PROFILE (User + Physical Stats)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Update Personal Details
        user.setFullName(userDetails.getFullName());
        user.setEmail(userDetails.getEmail());
        user.setGender(userDetails.getGender());
        user.setDateOfBirth(userDetails.getDateOfBirth());
        user.setBio(userDetails.getBio());

        // Update Physical Stats
        user.setWeight(userDetails.getWeight());
        user.setHeight(userDetails.getHeight());

        // Update Password (ONLY if the user typed something new)
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            // In a real app, you would encrypt this password here before saving!
            user.setPassword(userDetails.getPassword());
            System.out.println("🔒 Password updated for user: " + user.getEmail());
        }

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }
}