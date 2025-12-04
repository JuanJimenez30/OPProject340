package com.example.Greensboro.Lawncare.Company.GLC.Provider;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.Greensboro.Lawncare.Company.GLC.Services.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "providers")

public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("provider")
    private java.util.List<Services> services = new java.util.ArrayList<>();

    private String phoneNumber;

    public Provider(Long id) {
        this.id = id;
    }
}
