package com.example.ERP_System.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private  String sku;

    @Column(nullable = false)
    private String name;

    private String category;

    private BigDecimal unitPrice;

    private Integer currentStock = 0;

    private Integer reorderLevel;

}
