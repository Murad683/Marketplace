package az.marketplace.repository;

import az.marketplace.entity.ProductPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductPhotoRepository extends JpaRepository<ProductPhoto, Long> {

    List<ProductPhoto> findAllByProductId(Long productId);
}