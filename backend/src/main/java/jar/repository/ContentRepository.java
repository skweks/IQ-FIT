package jar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jar.model.Content;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    
    // Custom search commands we might need later:
    
    // Find all workouts
    List<Content> findByContentType(String contentType);
    
    // Find everything that is "PREMIUM"
    List<Content> findByAccessLevel(String accessLevel);
}