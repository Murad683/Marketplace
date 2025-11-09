package az.marketplace.dto.auth;

import az.marketplace.entity.enums.UserType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    private String name;

    @NotBlank
    private String surname;

    @NotNull
    private UserType type; // MERCHANT / CUSTOMER

    // yalnız MERCHANT üçün istifadə olunur
    private String companyName;
}