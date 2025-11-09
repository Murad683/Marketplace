package az.marketplace.repository;

import az.marketplace.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Bu annotasiya ilə Hibernate artıq lazy kolleksiyaları birbaşa join edib gətirəcək
    @EntityGraph(attributePaths = {"photos", "merchant", "category"})
    List<Product> findAll();
}