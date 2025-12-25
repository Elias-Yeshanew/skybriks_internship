package com.example.bookstore.dto;

import java.util.List;
import lombok.* ;

@Getter
@Setter
public class OrderRequest {
    private List<OrderItemRequest> items;
}
