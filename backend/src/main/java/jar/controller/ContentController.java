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

    // 1. Get all content
    @GetMapping
    public List<Content> getAllContent() {
        return contentRepository.findAll();
    }

    // 2. Add new content (Workout, Tip, etc.)
    @PostMapping
    public Content addContent(@RequestBody Content content) {
        return contentRepository.save(content);
    }
    
    // 3. Search by type
    @GetMapping("/search")
    public List<Content> searchByType(@RequestParam String type) {
        return contentRepository.findByContentType(type);
    }

    // 4. DELETE CONTENT (New Feature!)
    @DeleteMapping("/{id}")
    public void deleteContent(@PathVariable Long id) {
        contentRepository.deleteById(id);
    }
}