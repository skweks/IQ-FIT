package jar;

import jar.model.Content;
// import jar.model.Plan;
import jar.model.User;
import jar.model.ActivityLog;
import jar.repository.ContentRepository;
// import jar.repository.PlanRepository;
import jar.repository.UserRepository;
import jar.repository.ActivityLogRepository;

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
    private ActivityLogRepository activityLogRepository;

    // @Autowired
    // private PlanRepository planRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("⏳ Checking for seed data...");

        // 1. Load Content (if empty)
        if (contentRepository.count() == 0) {
            Content studyTip = new Content();
            studyTip.setTitle("The Pomodoro Technique");
            studyTip.setDescription("Work for 25 minutes, then take a 5 minute break.");
            studyTip.setContentType("STUDY_TIP");
            studyTip.setCategory("Time Management");
            studyTip.setDifficultyLevel("BEGINNER");
            studyTip.setAccessLevel("FREE");
            contentRepository.save(studyTip);

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

        // 2. Load Plans (if empty) - NEW!
        // if (planRepository.count() == 0) {
        //     Plan basic = new Plan();
        //     basic.setPlanName("Basic Monthly");
        //     basic.setDescription("Access to standard workouts and tips");
        //     basic.setPrice(9.99);
        //     basic.setDurationDays(30);
        //     planRepository.save(basic);

        //     Plan vip = new Plan();
        //     vip.setPlanName("VIP Annual");
        //     vip.setDescription("All access + personal coaching");
        //     vip.setPrice(99.99);
        //     basic.setDurationDays(365);
        //     planRepository.save(vip);
        //     System.out.println("✅ Plans loaded");
        // }

        // 3. Load Test User (if empty)
        if (userRepository.count() == 0) {
            User user = new User();
            user.setFullName("John Doe");
            user.setEmail("john@example.com");
            user.setPassword("password123");
            user.setRole("CLIENT");
            userRepository.save(user);
            System.out.println("✅ Test User loaded");
        }
        
        System.out.println("🚀 Application is ready!");
    }
}