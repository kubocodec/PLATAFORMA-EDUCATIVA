package com.platform.educativa.config;

import com.platform.educativa.model.entity.User;
import com.platform.educativa.model.enums.Role;
import com.platform.educativa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@educativa.com")) {
            User admin = User.builder()
                    .email("admin@educativa.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Administrador Principal")
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
        }
    }
}
