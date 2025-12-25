package com.example.bookstore.service;

import java.util.List;

import com.example.bookstore.entity.Book;

public interface BookService {


    List<Book> getAllBooks();

    Book getBookById(Long id);

    Book createBook(Book book);

    Book updateBook(Long id, Book bookDetails);

    void deleteBook(Long id);

}
