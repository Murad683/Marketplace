package az.marketplace.dto.order;

import az.marketplace.entity.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {

    @NotNull
    private OrderStatus status;

    // optional, yalnız REJECT_BY_MERCHANT / REJECT_BY_CUSTOMER üçün istifadə olunacaq
    private String rejectReason;
}