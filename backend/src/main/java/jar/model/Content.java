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

    @Column(columnDefinition = "TEXT") // Allows longer text for descriptions
    private String description;

    // Stores values like: WORKOUT, STUDY_TIP, VIDEO, ARTICLE
    private String contentType; 

    // Stores tags like: Cardio, Focus, Nutrition
    private String category; 

    // Stores: BEGINNER, INTERMEDIATE, ADVANCED
    private String difficultyLevel; 

    // Use Integer (not int) so it can be null for text-only tips
    private Integer durationMinutes; 

    private String videoUrl;

    // Stores: FREE, PREMIUM
    private String accessLevel; 

    private LocalDate uploadDate;

    @PrePersist
    protected void onCreate() {
        this.uploadDate = LocalDate.now();
    }
}