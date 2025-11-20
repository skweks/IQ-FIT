package jar.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Data
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // We link to the User (Many logs can belong to One user)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // We link to the Content (Many logs can be for One content item)
    @ManyToOne
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    // e.g., "STARTED", "COMPLETED"
    private String status; 

    private LocalDateTime dateAccessed;

    @PrePersist
    protected void onCreate() {
        this.dateAccessed = LocalDateTime.now();
    }
}