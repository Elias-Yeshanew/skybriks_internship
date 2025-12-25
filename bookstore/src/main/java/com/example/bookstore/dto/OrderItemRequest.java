package com.example.bookstore.dto;

import lombok.* ;

@Getter
@Setter
public class OrderItemRequest {
    private Long bookId;
    private Integer quantity;
}
