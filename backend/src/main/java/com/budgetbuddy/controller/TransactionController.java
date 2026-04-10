package com.budgetbuddy.controller;

import com.budgetbuddy.dto.ApiResponse;
import com.budgetbuddy.dto.TransactionDTO;
import com.budgetbuddy.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * GET /api/transactions?page=0&size=10
     * Response: 200 { "success": true, "data": { "content": [...], "totalElements": N, ... } }
     * GET /api/transactions?all=true
     * Response: 200 { "success": true, "data": [...] }
     */
    @GetMapping
    public ResponseEntity<?> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean all) {

        if (all) {
            List<TransactionDTO> transactions = transactionService.getAllTransactions();
            return ResponseEntity.ok(ApiResponse.success(transactions));
        }

        Page<TransactionDTO> transactions = transactionService.getTransactions(page, size);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    /**
     * POST /api/transactions
     * Request:  { "title":"Coffee", "amount":4.50, "type":"EXPENSE", "category":"FOOD",
     *             "transactionDate":"2024-01-15", "description":"Morning coffee" }
     * Response: 201 { "success": true, "data": { ...transactionDTO... } }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TransactionDTO>> createTransaction(
            @Valid @RequestBody TransactionDTO dto) {
        TransactionDTO created = transactionService.createTransaction(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction created", created));
    }

    /**
     * PUT /api/transactions/{id}
     * Request:  { "title":"Updated Coffee", "amount":5.00, ... }
     * Response: 200 { "success": true, "data": { ...transactionDTO... } }
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionDTO>> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionDTO dto) {
        TransactionDTO updated = transactionService.updateTransaction(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Transaction updated", updated));
    }

    /**
     * DELETE /api/transactions/{id}
     * Response: 200 { "success": true, "message": "Transaction deleted" }
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Transaction deleted successfully")
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }
}
