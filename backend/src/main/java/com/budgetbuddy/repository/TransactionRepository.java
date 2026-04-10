package com.budgetbuddy.repository;

import com.budgetbuddy.model.Transaction;
import com.budgetbuddy.model.Transaction.Category;
import com.budgetbuddy.model.Transaction.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByUserIdOrderByTransactionDateDescCreatedAtDesc(Long userId, Pageable pageable);

    List<Transaction> findByUserIdOrderByTransactionDateDescCreatedAtDesc(Long userId);

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId
          AND t.type = :type
          AND t.transactionDate BETWEEN :startDate AND :endDate
        """)
    BigDecimal sumByUserIdAndTypeAndDateBetween(
        @Param("userId") Long userId,
        @Param("type") TransactionType type,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId AND t.type = :type
        """)
    BigDecimal sumByUserIdAndType(
        @Param("userId") Long userId,
        @Param("type") TransactionType type
    );

    @Query("""
        SELECT t.category, COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId AND t.type = :type
        GROUP BY t.category
        """)
    List<Object[]> sumGroupedByCategoryAndType(
        @Param("userId") Long userId,
        @Param("type") TransactionType type
    );

    @Query("""
        SELECT FUNCTION('DATE_FORMAT', t.transactionDate, '%Y-%m') as month,
               COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) as income,
               COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) as expense
        FROM Transaction t
        WHERE t.user.id = :userId
          AND t.transactionDate >= :startDate
        GROUP BY FUNCTION('DATE_FORMAT', t.transactionDate, '%Y-%m')
        ORDER BY month ASC
        """)
    List<Object[]> getMonthlySummary(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate
    );

    List<Transaction> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);
}
