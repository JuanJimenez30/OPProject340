package com.example.Greensboro.Lawncare.Company.GLC.Provider;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional

public class ProviderService {
    private final ProviderRepository providerRepository;

    public Provider createProvider(Provider provider) {
        if (providerRepository.existsByEmail(provider.getEmail())) {
            throw new IllegalStateException("Email already registered");
        }
        return providerRepository.save(provider);
    }

    public Provider updateProvider(Long id, Provider providerDetails) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Provider not found"));

        provider.setName(providerDetails.getName());
        if (!provider.getEmail().equals(providerDetails.getEmail()) &&
                providerRepository.existsByEmail(providerDetails.getEmail())) {
            throw new IllegalStateException("Email already registered");
        }
        provider.setEmail(providerDetails.getEmail());
        provider.setPhoneNumber(providerDetails.getPhoneNumber());

        return providerRepository.save(provider);
    }

    public Provider getProviderById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Provider not found"));
    }

    public Provider getProviderByEmail(String email) {
        return providerRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Provider not found"));
    }

    public Provider authenticate(String email, String password) {
        Provider provider = providerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!provider.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return provider;
    }
}
