package com.faculdade.customer_service_back.dto.adminuser;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminUserUpdateDTO {

    @Size(max = 100, message = "Specialization must not exceed 100 characters")
    private String specialization;

    private Boolean active;
}
