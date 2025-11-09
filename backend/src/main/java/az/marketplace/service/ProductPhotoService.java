package az.marketplace.service;

import az.marketplace.dto.product.ProductPhotoResponse;
import az.marketplace.entity.Product;
import az.marketplace.entity.ProductPhoto;
import az.marketplace.exception.AccessDeniedException;
import az.marketplace.exception.NotFoundException;
import az.marketplace.repository.ProductPhotoRepository;
import az.marketplace.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ProductPhotoService {

    private final ProductRepository productRepository;
    private final ProductPhotoRepository productPhotoRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public ProductPhotoResponse uploadPhoto(Long productId, MultipartFile file) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        String ownerUsername = product.getMerchant().getUser().getUsername();

        // icazə: yalnız həmin merchant yaxud superuser
        if (!currentUserService.canManageProducts(ownerUsername)) {
            throw new AccessDeniedException("You cannot upload photo for this product");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file bytes", e);
        }

        ProductPhoto photo = ProductPhoto.builder()
                .product(product)
                .data(bytes)
                .contentType(
                        file.getContentType() != null
                                ? file.getContentType()
                                : MediaType.APPLICATION_OCTET_STREAM_VALUE
                )
                .build();

        photo = productPhotoRepository.save(photo);
        return new ProductPhotoResponse(photo.getId());
    }

    @Transactional(readOnly = true)
    public ProductPhoto getPhotoOrThrow(Long productId, Long photoId) {
        ProductPhoto photo = productPhotoRepository.findById(photoId)
                .orElseThrow(() -> new NotFoundException("Photo not found"));

        if (!photo.getProduct().getId().equals(productId)) {
            throw new NotFoundException("Photo does not belong to this product");
        }

        return photo;
    }
}