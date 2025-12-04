package jar.controller;

import jar.model.Message;
import jar.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    // 1. Send a Message (Public)
    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        return messageRepository.save(message);
    }

    // 2. Read Messages (Admin Only - Frontend will handle security check)
    @GetMapping
    public List<Message> getAllMessages() {
        // Sort by newest first
        List<Message> messages = messageRepository.findAll();
        messages.sort((a, b) -> b.getDateSent().compareTo(a.getDateSent()));
        return messages;
    }
    
    // 3. Delete Message
    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable Long id) {
        messageRepository.deleteById(id);
    }
}