package jar.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription;

    private Double amount;
    private LocalDateTime paymentDate;
    private String paymentMethod; // e.g., "GCash", "PayPal"
    private String status;        // e.g., "PAID"

    @PrePersist
    protected void onCreate() {
        this.paymentDate = LocalDateTime.now();
    }
}