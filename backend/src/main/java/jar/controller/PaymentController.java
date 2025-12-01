package jar.controller;

import jar.model.Payment;
import jar.model.Plan;
import jar.model.Subscription;
import jar.model.User;
import jar.repository.PaymentRepository;
import jar.repository.PlanRepository;
import jar.repository.SubscriptionRepository;
import jar.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    // Admin endpoint to see revenue
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // THE PAYMENT LOGIC
    @PostMapping("/pay")
    public Payment makePayment(@RequestBody PaymentRequest request) {
        
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        // 1. Create Subscription
        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setPlan(plan);
        sub.setStartDate(LocalDate.now());
        sub.setEndDate(LocalDate.now().plusDays(plan.getDurationDays()));
        sub.setIsActive(true);
        Subscription savedSub = subscriptionRepository.save(sub);

        // 2. CRITICAL: Upgrade User Status to Premium
        // This makes the 'isPremium' flag true in the database
        user.setPremium(true);
        userRepository.save(user);

        // 3. Record Payment
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setSubscription(savedSub);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus("PAID");

        return paymentRepository.save(payment);
    }
}

// Helper Class
class PaymentRequest {
    private Long userId;
    private Long planId;
    private Double amount;
    private String paymentMethod;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}