package jar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jar.model.User;
import jar.repository.UserRepository;
import jar.repository.ActivityLogRepository;
import jar.repository.PaymentRepository;
import jar.repository.SubscriptionRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

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

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        long count = userRepository.count();
        String role = count == 0 ? "SUPER_ADMIN" : "USER";
        user.setRole(role);
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        user.setPremium(false);
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        if (user.getPassword() != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
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

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(userDetails.getFullName());
        user.setEmail(userDetails.getEmail());
        user.setGender(userDetails.getGender());
        user.setDateOfBirth(userDetails.getDateOfBirth());
        user.setBio(userDetails.getBio());
        user.setWeight(userDetails.getWeight());
        user.setHeight(userDetails.getHeight());

        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
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
    public ResponseEntity<?> updateRole(@PathVariable Long id,
            @RequestParam Long actorId,
            @RequestBody Map<String, String> request) {
        String newRole = request.get("role");
        User actor = userRepository.findById(actorId).orElse(null);
        if (actor == null)
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Actor not found");
        if (!"SUPER_ADMIN".equals(actor.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only SUPER_ADMIN can change roles");
        }
        return userRepository.findById(id).map(target -> {
            if ("SUPER_ADMIN".equals(target.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("SUPER_ADMIN role cannot be changed");
            }
            target.setRole(newRole);
            User updatedUser = userRepository.save(target);
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

    // Purge all users and related data (payments, subscriptions, activity logs)
    @DeleteMapping("/purge")
    public ResponseEntity<?> purgeAllUsers() {
        paymentRepository.deleteAll();
        subscriptionRepository.deleteAll();
        activityLogRepository.deleteAll();
        userRepository.deleteAll();
        return ResponseEntity.ok("All users and related data purged");
    }
}
