package jar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jar.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This gives us ready-to-use commands like:
    // userRepository.save(user);
    // userRepository.findById(id);
    
    // We can add custom ones easily:
    // User findByEmail(String email);
}