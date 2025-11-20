package jar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jar.model.ActivityLog;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    // Find all activities for a specific user (User History)
    List<ActivityLog> findByUserId(Long userId);
    
    // Find all completed items for a user
    List<ActivityLog> findByUserIdAndStatus(Long userId, String status);
}