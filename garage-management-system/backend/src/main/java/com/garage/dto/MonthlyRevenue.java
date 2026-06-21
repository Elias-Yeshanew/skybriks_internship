package com.garage.dto;
import lombok.*;
import java.math.BigDecimal;
@Data @NoArgsConstructor @AllArgsConstructor
public class MonthlyRevenue {
    private String month;
    private BigDecimal revenue;
}
