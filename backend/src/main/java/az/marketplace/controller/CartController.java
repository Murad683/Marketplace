package az.marketplace.controller;

import az.marketplace.dto.cart.AddToCartRequest;
import az.marketplace.dto.cart.CartItemResponse;
import az.marketplace.entity.Customer;
import az.marketplace.service.CartService;
import az.marketplace.service.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;
    private final CurrentUserService currentUserService;

    // GET /cart → hazırki customer-in səbəti
    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart() {
        Customer customer = currentUserService.getCurrentCustomerOrThrow();
        return ResponseEntity.ok(cartService.getCartItems(customer));
    }

    // POST /cart/items
    @PostMapping("/items")
    public ResponseEntity<CartItemResponse> addItem(
            @Valid @RequestBody AddToCartRequest req
    ) {
        Customer customer = currentUserService.getCurrentCustomerOrThrow();
        return ResponseEntity.ok(cartService.addToCart(customer, req));
    }

    // DELETE /cart/items/{itemId}
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId) {
        Customer customer = currentUserService.getCurrentCustomerOrThrow();
        cartService.removeItem(customer, itemId);
        return ResponseEntity.noContent().build();
    }
}