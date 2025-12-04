package jar.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty; // <--- 1. Add this Import
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String password;

    private LocalDate dateOfBirth;

    private String gender;

    private String role; 

    // --- 2. Add this Annotation ---
    // This forces the JSON key to stay "isPremium" instead of shortening to "premium"
    @JsonProperty("isPremium") 
    private boolean isPremium = false; 

    private boolean suspended = false;

    @Column(columnDefinition = "TEXT")
    private String bio;
    
  
    private Double weight; // in kg
    private Double height; // in cm
    // ------------------

    private LocalDate joinDate;

    @PrePersist
    protected void onCreate() {
        this.joinDate = LocalDate.now();
    }
}