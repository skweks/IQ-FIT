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

    // NEW: Find content by type and minimum access level (e.g., only FREE content)
    List<Content> findByContentTypeAndAccessLevel(String contentType, String accessLevel);

    // Find everything that is "PREMIUM"
    List<Content> findByAccessLevel(String accessLevel);
}