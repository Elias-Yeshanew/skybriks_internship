package com.example.bookstore.entity;

import lombok.* ;
import jakarta.persistence.* ;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Book book;

    private Integer quantity;

    private Double price;
}
