package az.marketplace.service;

import az.marketplace.dto.product.ProductResponse;
import az.marketplace.entity.Customer;
import az.marketplace.entity.Product;
import az.marketplace.entity.WishList;
import az.marketplace.exception.AccessDeniedException;
import az.marketplace.exception.NotFoundException;
import az.marketplace.repository.ProductRepository;
import az.marketplace.repository.WishListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishListService {

    private final WishListRepository wishListRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    @Transactional(readOnly = true)
    public List<ProductResponse> getWishList(Customer customer) {
        return wishListRepository.findByCustomer(customer)
                .stream()
                .map(WishList::getProduct)
                .map(productService::toProductResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse addToWishList(Customer customer, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        // artıq varsa, yenidən yaratmırıq
        wishListRepository.findByCustomerAndProduct(customer, product)
                .orElseGet(() -> wishListRepository.save(
                        WishList.builder()
                                .customer(customer)
                                .product(product)
                                .createdAt(LocalDateTime.now())
                                .build()
                ));

        return productService.toProductResponse(product);
    }

    @Transactional
    public void removeWishListItemByProductId(Customer customer, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        WishList wl = wishListRepository.findByCustomerAndProduct(customer, product)
                .orElseThrow(() -> new NotFoundException("Wishlist item not found"));

        if (!wl.getCustomer().getId().equals(customer.getId())) {
            throw new AccessDeniedException("You cannot remove this wishlist item");
        }

        wishListRepository.delete(wl);
    }
}