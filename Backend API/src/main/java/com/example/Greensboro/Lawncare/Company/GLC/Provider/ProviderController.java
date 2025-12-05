package com.example.Greensboro.Lawncare.Company.GLC.Provider;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor

public class ProviderController {

    private final ProviderService providerService;

    @PostMapping
    public ResponseEntity<Provider> createProvider(@Valid @RequestBody Provider provider) {
        return ResponseEntity.ok(providerService.createProvider(provider));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Provider> updateProvider(@PathVariable Long id, @RequestBody Provider providerDetails) {
        return ResponseEntity.ok(providerService.updateProvider(id, providerDetails));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Provider> getProvider(@PathVariable Long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }

    // Authentication endpoint for provider login (demo only — plaintext passwords)
    @PostMapping("/authenticate")
    public ResponseEntity<Provider> authenticate(@RequestBody java.util.Map<String, String> creds) {
        // Accept either { "username": "...", "password": "..." } or { "email": "...", "password": "..." }
        String username = creds.get("username");
        String email = creds.get("email");
        String password = creds.get("password");
        if ((username == null && email == null) || password == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Provider p;
            if (username != null) {
                p = providerService.authenticateByUsername(username, password);
            } else {
                p = providerService.authenticate(email, password);
            }
            return ResponseEntity.ok(p);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(401).build();
        }
    }

}
