package az.marketplace.repository;

import az.marketplace.entity.WishList;
import az.marketplace.entity.Customer;
import az.marketplace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WishListRepository extends JpaRepository<WishList, Long> {

    List<WishList> findByCustomer(Customer customer);

    Optional<WishList> findByCustomerAndProduct(Customer customer, Product product);

    void deleteByCustomerAndProduct(Customer customer, Product product);

    // scheduler üçün: köhnə itemləri tapmaq
    List<WishList> findByCreatedAtBefore(LocalDateTime timeThreshold);
}