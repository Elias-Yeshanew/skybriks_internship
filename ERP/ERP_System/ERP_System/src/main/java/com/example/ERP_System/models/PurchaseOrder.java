package com.example.ERP_System.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
@Data
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    private LocalDate orderDate = LocalDate.now();

    @OneToMany(cascade =  CascadeType.ALL)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private List<PurchaseOrderItem> items;
}
