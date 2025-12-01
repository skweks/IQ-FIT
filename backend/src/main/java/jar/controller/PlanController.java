package jar.controller;

import jar.model.Plan;
import jar.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "http://localhost:3000") // Allow React to access this
public class PlanController {

    @Autowired
    private PlanRepository planRepository;

    // Endpoint to get all plans
    @GetMapping
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }
}