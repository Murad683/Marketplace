package az.marketplace.dto.order;

import az.marketplace.entity.enums.OrderStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;

    private Long productId;
    private String productName;

    private Integer count;
    private Double totalAmount;

    private OrderStatus status;

    private String rejectReason;

    private LocalDateTime createdAt;
}