package com.budgetbuddy.service;

import com.budgetbuddy.dto.TransactionDTO;
import com.budgetbuddy.exception.ResourceNotFoundException;
import com.budgetbuddy.mapper.TransactionMapper;
import com.budgetbuddy.model.Transaction;
import com.budgetbuddy.model.User;
import com.budgetbuddy.repository.TransactionRepository;
import com.budgetbuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionMapper transactionMapper;

    @Transactional(readOnly = true)
    public Page<TransactionDTO> getTransactions(int page, int size) {
        Long userId = getCurrentUserId();
        Pageable pageable = PageRequest.of(page, size);
        return transactionRepository
                .findByUserIdOrderByTransactionDateDescCreatedAtDesc(userId, pageable)
                .map(transactionMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getAllTransactions() {
        Long userId = getCurrentUserId();
        return transactionMapper.toDTOList(
                transactionRepository.findByUserIdOrderByTransactionDateDescCreatedAtDesc(userId)
        );
    }

    @Transactional
    public TransactionDTO createTransaction(TransactionDTO dto) {
        Long userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Transaction transaction = transactionMapper.toEntity(dto);
        transaction.setUser(user);

        Transaction saved = transactionRepository.save(transaction);
        log.info("Transaction created: id={}, userId={}", saved.getId(), userId);
        return transactionMapper.toDTO(saved);
    }

    @Transactional
    public TransactionDTO updateTransaction(Long id, TransactionDTO dto) {
        Long userId = getCurrentUserId();
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transaction not found with id: " + id));

        transactionMapper.updateEntityFromDTO(dto, transaction);
        Transaction updated = transactionRepository.save(transaction);
        log.info("Transaction updated: id={}, userId={}", id, userId);
        return transactionMapper.toDTO(updated);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        Long userId = getCurrentUserId();
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transaction not found with id: " + id));

        transactionRepository.delete(transaction);
        log.info("Transaction deleted: id={}, userId={}", id, userId);
    }

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"))
                .getId();
    }
}
