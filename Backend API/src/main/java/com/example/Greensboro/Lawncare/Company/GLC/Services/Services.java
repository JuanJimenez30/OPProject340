package com.example.Greensboro.Lawncare.Company.GLC.Services;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.example.Greensboro.Lawncare.Company.GLC.Reviews.*;
import com.example.Greensboro.Lawncare.Company.GLC.Provider.Provider;
import com.example.Greensboro.Lawncare.Company.GLC.Subscription.Subscription;

@Data
@NoArgsConstructor
@Entity
@Table(name = "services")

public class Services {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Optional base64-encoded image data (data URL). Stored as TEXT to
    // allow large payloads. For production it's better to store files and
    // persist URLs instead of base64 in the DB.
    @Column(columnDefinition = "TEXT")
    private String imageData;

    @NotNull
    @Positive
    private BigDecimal price;

    @NotNull
    private boolean available = true;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    @JsonIgnoreProperties("services")
    private Provider provider;

     @OneToMany(mappedBy = "services", cascade = CascadeType.ALL)
     @JsonIgnoreProperties("services")
     private List<Subscription> subscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "services", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("services")
    private List<Reviews> reviews = new ArrayList<>();
}
