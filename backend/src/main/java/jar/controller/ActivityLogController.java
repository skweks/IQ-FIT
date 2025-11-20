package jar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jar.model.ActivityLog;
import jar.model.Content;
import jar.model.User;
import jar.repository.ActivityLogRepository;
import jar.repository.ContentRepository;
import jar.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = "http://localhost:3000")
public class ActivityLogController {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContentRepository contentRepository;

    // 1. Log an activity (e.g., User 1 completed Workout 5)
    @PostMapping
    public ActivityLog logActivity(@RequestBody LogRequest request) {
        ActivityLog log = new ActivityLog();
        
        // Find the actual User and Content objects from the database
        User user = userRepository.findById(request.getUserId()).orElseThrow();
        Content content = contentRepository.findById(request.getContentId()).orElseThrow();
        
        log.setUser(user);
        log.setContent(content);
        log.setStatus(request.getStatus());
        
        return activityLogRepository.save(log);
    }

    // 2. Get history for a specific user
    @GetMapping("/user/{userId}")
    public List<ActivityLog> getUserHistory(@PathVariable Long userId) {
        return activityLogRepository.findByUserId(userId);
    }
}

// Helper class to receive data from React
// We put it here to keep things simple
class LogRequest {
    private Long userId;
    private Long contentId;
    private String status;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}