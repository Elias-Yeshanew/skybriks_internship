package com.example.bookstore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.bookstore.entity.Book;


@Repository
public interface  BookRepository  extends  JpaRepository<Book, Long> {

    Optional<Book> findByTitle(String title);
    boolean existsByTitle(String title);
    boolean existsByIsbn(String isbn);
    Optional<Book> findByIsbn(String isbn);
    Optional<Book> findByAuthors(String authors);
    Optional<Book> findByGenre(String genre);
}


