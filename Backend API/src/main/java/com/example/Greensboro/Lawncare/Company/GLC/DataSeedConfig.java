package com.example.Greensboro.Lawncare.Company.GLC;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.Greensboro.Lawncare.Company.GLC.Provider.Provider;
import com.example.Greensboro.Lawncare.Company.GLC.Provider.ProviderRepository;

/**
 * Small startup data seed for development/demo.
 * Ensures one provider exists so the app can operate as a single-provider demo.
 * Safe to remove later.
 */
@Configuration
public class DataSeedConfig {

    @Bean
    CommandLineRunner seedProvider(ProviderRepository providerRepository) {
        return args -> {
            final String email = "provider@example.com";
            if (!providerRepository.existsByEmail(email)) {
                Provider p = new Provider();
                p.setName("Greensboro LawnCare Company");
                p.setEmail(email);
                p.setPassword("changeme"); // demo-only plain text
                p.setPhoneNumber("555-123-4567");
                providerRepository.save(p);
                System.out.println("Seeded provider: " + email);
            } else {
                System.out.println("Provider already exists: " + email);
            }
        };
    }
}
