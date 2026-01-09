package com.example.bookstore.exception;

import java.time.LocalDateTime;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 404 NOT FOUND
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
        ResourceNotFoundException ex,
        HttpServletRequest request){

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
            ));
        }
    // 400 BAD REQUEST
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(
        BadRequestException ex,
        HttpServletRequest request){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                request.getRequestURI()
            ));
        }

    // 401 UNAUTHORIZED
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(
        UnauthorizedException ex,
        HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.UNAUTHORIZED.value(),
                "Unauthorized",
                ex.getMessage(),
                request.getRequestURI()

            ));
        }

        // 500 INTERNAL SERVER ERROR
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGeneral(
            Exception ex,
            HttpServletRequest request){
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(
                    LocalDateTime.now(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "INTERNAL SERVER ISSUE",
                    ex.getMessage(),
                    request.getRequestURI()
                ));
            }
}

