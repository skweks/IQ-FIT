package jar.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "content")
@Data
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String contentType; // WORKOUT, STUDY_TIP, RECIPE
    private String category; 
    private String difficultyLevel; 
    private String accessLevel; 
    private Integer durationMinutes; 
    private String videoUrl;

    // --- NEW FIELDS FOR YOUR NEW LOGIC ---
    private Integer sets;           // e.g., 3
    private String reps;            // e.g., "12" or "8-10"
    private Integer restTimeSeconds; // e.g., 20
    // -------------------------------------

    private LocalDate uploadDate;

    // This will store JSON data like: { "benefits": [], "steps": [] }
    @Column(columnDefinition = "TEXT") 
    private String details; 

    @PrePersist
    protected void onCreate() {
        this.uploadDate = LocalDate.now();
    }
}