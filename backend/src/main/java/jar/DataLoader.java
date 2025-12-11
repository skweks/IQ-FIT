package jar;

import jar.model.Content;
import jar.model.Plan;
import jar.model.User;
import jar.repository.ContentRepository;
import jar.repository.PlanRepository;
import jar.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlanRepository planRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("⏳ Checking for seed data...");

        // --- 1. Load Content ---
        if (contentRepository.count() == 0) {
            // ... (Your existing content loading logic remains here if you have it)
            // For brevity, ensuring we have at least one workout
            Content workout = new Content();
            workout.setTitle("Morning HIIT Blast");
            workout.setDescription("High intensity interval training.");
            workout.setContentType("WORKOUT");
            workout.setCategory("Cardio");
            workout.setDifficultyLevel("INTERMEDIATE");
            workout.setDurationMinutes(15);
            workout.setAccessLevel("PREMIUM");
            contentRepository.save(workout);
            System.out.println("✅ Content loaded");
        }

        // --- 2. Load Membership Plans (UPDATED) ---
        if (planRepository.count() == 0) {
            
            // Free Plan (Optional: helps if you want a default subscription)
            Plan free = new Plan();
            free.setPlanName("Free Starter");
            free.setDescription("Perfect for getting started");
            free.setPrice(0.00);
            free.setDurationDays(36500); // 100 years (effectively forever)
            planRepository.save(free);

            // Premium Monthly
            Plan monthly = new Plan();
            monthly.setPlanName("Premium Monthly");
            monthly.setDescription("Unlock your full potential");
            monthly.setPrice(12.99);
            monthly.setDurationDays(30);
            planRepository.save(monthly);

            // Premium Yearly
            Plan yearly = new Plan();
            yearly.setPlanName("Premium Yearly");
            yearly.setDescription("Best value for committed athletes");
            yearly.setPrice(99.99); // Significant discount logic
            yearly.setDurationDays(365);
            planRepository.save(yearly);
            
            System.out.println("✅ Plans loaded into database!");
        }

        // --- 3. Load Users ---
        if (userRepository.findByEmail("admin@iqfit.com") == null) {
            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@iqfit.com");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("✅ ADMIN Account loaded");
        }
        
        System.out.println("🚀 Application is ready!");
    }
}