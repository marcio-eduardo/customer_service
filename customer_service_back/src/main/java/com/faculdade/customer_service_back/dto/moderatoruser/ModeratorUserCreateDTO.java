package com.faculdade.customer_service_back.dto.moderatoruser;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ModeratorUserCreateDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;

    @Min(value = 1, message = "Access level must be between 1 and 5")
    @Max(value = 5, message = "Access level must be between 1 and 5")
    private Integer accessLevel = 5;

    private Boolean active = true;
}
