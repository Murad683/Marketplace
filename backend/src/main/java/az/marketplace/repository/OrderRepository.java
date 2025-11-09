package az.marketplace.repository;

import az.marketplace.entity.Customer;
import az.marketplace.entity.Merchant;
import az.marketplace.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Müştərinin öz sifarişləri
    List<Order> findByCustomer(Customer customer);

    // Product silmə üçün istifadə olunur
    boolean existsByProduct_Id(Long productId);

    // Merchant-ın məhsullarına verilmiş sifarişlər (customer rədd etdiyi sifarişləri gizlədirik)
    @Query("""
        SELECT o
        FROM Order o
        JOIN o.product p
        WHERE p.merchant = :merchant
          AND o.status <> az.marketplace.entity.enums.OrderStatus.REJECT_BY_CUSTOMER
    """)
    List<Order> findOrdersForMerchant(Merchant merchant);
}