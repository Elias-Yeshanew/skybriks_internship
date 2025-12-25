package com.example.bookstore.dto;

import lombok.* ;
import  com.example.bookstore.entity.OrderStatus;

@Getter
@Setter
public class UpdateOrderStatusRequest {
    private OrderStatus status;
}
