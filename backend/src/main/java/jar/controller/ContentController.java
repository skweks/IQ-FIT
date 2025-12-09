package jar.controller;

import jar.model.Content;
import jar.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "http://localhost:3000")
public class ContentController {

    @Autowired
    private ContentRepository contentRepository;

    @GetMapping
    public List<Content> getAllContent() {
        return contentRepository.findAll();
    }

    @PostMapping
    public Content addContent(@RequestBody Content content) {
        return contentRepository.save(content);
    }
    
    @GetMapping("/search")
    public List<Content> searchByType(@RequestParam String type) {
        return contentRepository.findByContentType(type);
    }

    @DeleteMapping("/{id}")
    public void deleteContent(@PathVariable Long id) {
        contentRepository.deleteById(id);
    }

    // --- NEW: EDIT CONTENT ---
    @PutMapping("/{id}")
    public Content updateContent(@PathVariable Long id, @RequestBody Content contentDetails) {
        Content content = contentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Content not found"));

        content.setTitle(contentDetails.getTitle());
        content.setDescription(contentDetails.getDescription());
        content.setContentType(contentDetails.getContentType());
        content.setCategory(contentDetails.getCategory());
        content.setDifficultyLevel(contentDetails.getDifficultyLevel());
        content.setAccessLevel(contentDetails.getAccessLevel());
        content.setDurationMinutes(contentDetails.getDurationMinutes());
        content.setVideoUrl(contentDetails.getVideoUrl());
        
        // Update Set/Rep logic
        content.setSets(contentDetails.getSets());
        content.setReps(contentDetails.getReps());
        content.setRestTimeSeconds(contentDetails.getRestTimeSeconds());

        // --- NEW ---
        content.setDetails(contentDetails.getDetails());
        // -----------

        return contentRepository.save(content);
    }
}