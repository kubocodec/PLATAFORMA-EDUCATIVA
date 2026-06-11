package com.platform.educativa.service;

import com.platform.educativa.model.dto.BrandDto;
import com.platform.educativa.model.dto.BrandRequest;
import com.platform.educativa.model.entity.Brand;
import com.platform.educativa.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    public List<BrandDto> getAllBrands(boolean activeOnly) {
        List<Brand> brands = activeOnly ? brandRepository.findByActiveTrue() : brandRepository.findAll();
        return brands.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public BrandDto getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Marca no encontrada con id: " + id));
        return mapToDto(brand);
    }

    @Transactional
    public BrandDto createBrand(BrandRequest request) {
        Brand brand = Brand.builder()
                .name(request.getName())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .build();
        return mapToDto(brandRepository.save(brand));
    }

    @Transactional
    public BrandDto updateBrand(Long id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Marca no encontrada con id: " + id));
        
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setActive(request.isActive());
        
        return mapToDto(brandRepository.save(brand));
    }

    @Transactional
    public void deleteBrand(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new IllegalArgumentException("Marca no encontrada con id: " + id);
        }
        brandRepository.deleteById(id);
    }

    private BrandDto mapToDto(Brand brand) {
        return BrandDto.builder()
                .id(brand.getId())
                .name(brand.getName())
                .description(brand.getDescription())
                .logoUrl(brand.getLogoUrl())
                .active(brand.isActive())
                .createdAt(brand.getCreatedAt())
                .build();
    }
}
