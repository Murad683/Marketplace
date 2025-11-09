package az.marketplace.dto.order;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CancelOrderRequest {
    @NotBlank
    private String reason;
}