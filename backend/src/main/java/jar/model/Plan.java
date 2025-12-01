package jar.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "plans")
@Data
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String planName; // e.g., "Monthly VIP"
    private String description;
    private Double price;
    private Integer durationDays; // e.g., 30
}