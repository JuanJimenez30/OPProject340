package com.example.Greensboro.Lawncare.Company.GLC.Services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import com.example.Greensboro.Lawncare.Company.GLC.Provider.Provider;
import com.example.Greensboro.Lawncare.Company.GLC.Provider.ProviderRepository;

@Service
@RequiredArgsConstructor
@Transactional

public class ServicesService {

    private final ServicesRepository servicesRepository;
    private final ProviderRepository providerRepository;

    public Services createService(Services service) {
        // If a provider id was sent in the request, resolve it to a managed entity
        if (service.getProvider() != null && service.getProvider().getId() != null) {
            Long providerId = service.getProvider().getId();
            Provider provider = providerRepository.findById(providerId)
                    .orElseThrow(() -> new EntityNotFoundException("Provider not found with id: " + providerId));
            service.setProvider(provider);
        } else {
            // If no provider supplied, ensure provider is null to avoid transient object issues
            service.setProvider(null);
        }

        return servicesRepository.save(service);
    }

    public Services updateService(Long id, Services serviceDetails) {
        Services service = servicesRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Service not found"));

        service.setName(serviceDetails.getName());
        service.setDescription(serviceDetails.getDescription());
    // persist image data if provided (may be null)
    service.setImageData(serviceDetails.getImageData());
        service.setPrice(serviceDetails.getPrice());
        service.setAvailable(serviceDetails.isAvailable());

        return servicesRepository.save(service);
    }

    public void deleteService(Long id) {
        if (!servicesRepository.existsById(id)) {
            throw new EntityNotFoundException("Service not found");
        }
        servicesRepository.deleteById(id);
    }

    public Services getServiceById(Long id) {
        return servicesRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Service not found"));
    }

    public List<Services> getAllServices() {
        return servicesRepository.findAll();
    }

    public List<Services> getAvailableServices() {
        return servicesRepository.findByAvailableTrue();
    }

}
