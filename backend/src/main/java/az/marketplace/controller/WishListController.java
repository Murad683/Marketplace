package az.marketplace.controller;

import az.marketplace.dto.product.ProductResponse;
import az.marketplace.dto.wishlist.WishListRequest;
import az.marketplace.entity.Customer;
import az.marketplace.service.CurrentUserService;
import az.marketplace.service.WishListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/wishlist")
public class WishListController {

    private final WishListService wishListService;
    private final CurrentUserService currentUserService;

    // GET /wishlist
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getWishlist() {
        Customer customer = currentUserService.getCurrentCustomerOrThrow();
        return ResponseEntity.ok(wishListService.getWishList(customer));
    }

    // POST /wishlist  body: { "productId": 123 }
    @PostMapping
    public ResponseEntity<ProductResponse> addWishlist(
            @RequestBody WishListRequest request
    ) {
        Customer customer = currentUserService.getCurrentCustomerOrThrow();
        return ResponseEntity.ok(
                wishListService.addToWishList(customer, request.getProductId())
        );
    }

    // DELETE /wishlist/{productId}
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteWishlistItem(@PathVariable Long productId) {
        Customer customer = currentUserService.getCurrentCustomerOrThrow();
        wishListService.removeWishListItemByProductId(customer, productId);
        return ResponseEntity.noContent().build();
    }
}