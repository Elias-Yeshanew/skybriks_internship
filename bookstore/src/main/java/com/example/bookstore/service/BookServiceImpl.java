package com.example.bookstore.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.bookstore.entity.Book;
import com.example.bookstore.repository.BookRepository;

@Service
public class BookServiceImpl implements BookService  {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id " + id));
    }

    @Override
    public Book createBook(Book book) {
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            throw new RuntimeException("Book with ISBN " + book.getIsbn() + " already exists");
        }

        return bookRepository.save(book);
    }

    @Override
    public Book updateBook(Long id, Book bookDetails) {
        Book book = getBookById(id);

        book.setTitle(bookDetails.getTitle());
        book.setAuthors(bookDetails.getAuthors());
        book.setGenre(bookDetails.getGenre());
        book.setIsbn(bookDetails.getIsbn());
        book.setPrice(bookDetails.getPrice());
        book.setStockQuantity(bookDetails.getStockQuantity());
        book.setDescription(bookDetails.getDescription());

        if (bookRepository.existsByIsbn(book.getIsbn()) && !book.getId().equals(id)) {
            throw new RuntimeException("Book with ISBN " + book.getIsbn() + " already exists");
        }

        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Long id) {
        Book book = getBookById(id);
        bookRepository.delete(book);
    }
}
