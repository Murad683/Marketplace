package az.marketplace.dto.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotNull
    private Long categoryId;

    @NotBlank
    private String name;

    @NotBlank
    private String details;

    @NotNull
    @Min(0)
    private Double price;

    @NotNull
    @Min(0)
    private Integer stockCount;

    // DIQQƏT:
    // əvvəllər burada photoUrls var idi.
    // Artıq YOXDUR.
    //
    // Şəkil ayrıca endpointlə yüklənir:
    // POST /products/{productId}/photos  (multipart/form-data ilə "file")
}