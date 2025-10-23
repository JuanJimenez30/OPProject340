package com.example.Greensboro.Lawncare.Company.GLC.Services;

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

    public Services createService(Services service) {
        return servicesRepository.save(service);
    }

    public Services updateService(Long id, Services serviceDetails) {
        Services service = servicesRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Service not found"));

        service.setName(serviceDetails.getName());
        service.setDescription(serviceDetails.getDescription());
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
