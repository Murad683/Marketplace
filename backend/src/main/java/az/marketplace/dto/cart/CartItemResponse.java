package az.marketplace.dto.cart;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {

    private Long itemId;

    private Long productId;
    private String productName;

    private Integer count;

    private Double pricePerUnit;
    private Double totalPrice;
}