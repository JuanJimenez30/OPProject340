package com.example.Greensboro.Lawncare.Company.GLC.Services;

import com.example.Greensboro.Lawncare.Company.GLC.Provider.ProviderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional

public class ServicesService {

    private final ServicesRepository servicesRepository;
    private final ProviderRepository providerRepository;

    /**
     * Create a service. If the client did not supply a provider, automatically
     * attach provider id 1 (hardcoded) when that provider exists in the DB.
     * This is a simple server-side convenience to avoid requiring the client
     * to always include provider information.
     */
    public Services createService(Services service) {
        if (service.getProvider() == null) {
            // hardcoded provider id (change to desired id if needed)
            final Long fallbackProviderId = 1L;
            providerRepository.findById(fallbackProviderId).ifPresent(service::setProvider);
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
