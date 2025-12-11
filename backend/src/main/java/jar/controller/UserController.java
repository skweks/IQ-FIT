package jar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import jar.model.User;
import jar.repository.UserRepository;
import jar.repository.ActivityLogRepository;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired // <-- Inject the BCrypt function
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        // CRITICAL FIX: Hash the password before saving a new user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        // CRITICAL FIX: Use BCryptPasswordEncoder.matches() for secure comparison.
        // .matches() compares the raw string with the hash.
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @PutMapping("/{id}/suspend")
    public User toggleSuspendUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setSuspended(!user.isSuspended());
        return userRepository.save(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok) // Return 200 OK if found
                .orElse(ResponseEntity.notFound().build()); // Return 404 Not Found if not found
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(userDetails.getFullName());
            user.setEmail(userDetails.getEmail());
            user.setGender(userDetails.getGender());
            user.setDateOfBirth(userDetails.getDateOfBirth());
            user.setBio(userDetails.getBio());
            user.setWeight(userDetails.getWeight());
            user.setHeight(userDetails.getHeight());

            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                // CRITICAL FIX: Hash new password before saving it
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }).orElse(ResponseEntity.notFound().build()); // Return 404 if user not found
    }

    // --- MANAGE SUBSCRIPTION STATUS (Cancel/Upgrade via Query Param) ---
    @PutMapping("/{id}/subscription")
    public ResponseEntity<User> updateSubscriptionStatus(@PathVariable Long id, @RequestParam boolean isPremium) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPremium(isPremium);
        return ResponseEntity.ok(userRepository.save(user));
    }

    // --- GET USER STATS ---
    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Long>> getUserStats(@PathVariable Long id) {
        long workouts = activityLogRepository.countByUserIdAndStatusAndContentContentType(id, "COMPLETED", "WORKOUT");
        long study = activityLogRepository.countByUserIdAndStatusAndContentContentType(id, "COMPLETED", "STUDY_TIP");
        long recipes = activityLogRepository.countByUserIdAndStatusAndContentContentType(id, "COMPLETED", "RECIPE");

        Map<String, Long> stats = new HashMap<>();
        stats.put("workouts", workouts);
        stats.put("studySessions", study);
        stats.put("recipesTried", recipes);

        return ResponseEntity.ok(stats);
    } // <--- THIS BRACE WAS MISSING IN YOUR CODE

    // --- UPDATE ROLE (Promote/Demote) ---
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newRole = request.get("role");
        return userRepository.findById(id).map(user -> {
            user.setRole(newRole);
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- UPDATE PREMIUM STATUS (Grant/Revoke) ---
    @PutMapping("/{id}/premium")
    public ResponseEntity<User> updatePremiumStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        Boolean isPremium = request.get("isPremium");
        return userRepository.findById(id).map(user -> {
            user.setPremium(isPremium);
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }).orElse(ResponseEntity.notFound().build());
    }
}