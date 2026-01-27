package com.example.ERP_System.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sales_order_items")
@Data
public class SalesOrderItem {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;
    private Double unitPrice;
}
