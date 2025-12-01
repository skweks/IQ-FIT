package jar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jar.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This finds a user by their email address (Essential for Login!)
    User findByEmail(String email);
}