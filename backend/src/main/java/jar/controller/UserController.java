package jar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null) return ResponseEntity.status(401).body("User not found");
        if (user.getPassword().equals(loginRequest.getPassword())) return ResponseEntity.ok(user);
        else return ResponseEntity.status(401).body("Invalid email or password");
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @PutMapping("/{id}/suspend")
    public User toggleSuspendUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setSuspended(!user.isSuspended());
        return userRepository.save(user);
    }

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
        user.setWeight(userDetails.getWeight());
        user.setHeight(userDetails.getHeight());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    // --- NEW: MANAGE SUBSCRIPTION STATUS (Cancel/Upgrade) ---
    @PutMapping("/{id}/subscription")
    public ResponseEntity<User> updateSubscriptionStatus(@PathVariable Long id, @RequestParam boolean isPremium) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPremium(isPremium); // Updates the DB
        return ResponseEntity.ok(userRepository.save(user));
    }
    // --------------------------------------------------------

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
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newRole = request.get("role");
        return userRepository.findById(id).map(user -> {
            user.setRole(newRole);
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Endpoint to update a user's premium status
    @PutMapping("/{id}/premium")
    public ResponseEntity<User> updatePremiumStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        Boolean isPremium = request.get("isPremium");
        return userRepository.findById(id).map(user -> {
            user.setPremium(isPremium);

            // Log the change for audit purposes (optional, but good practice)
            System.out.println("Admin updated user " + id + " premium status to: " + isPremium);

            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }).orElse(ResponseEntity.notFound().build());
    }
}