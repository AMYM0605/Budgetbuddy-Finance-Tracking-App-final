package com.budgetbuddy.service;

import com.budgetbuddy.dto.DashboardDTO;
import com.budgetbuddy.dto.DashboardDTO.MonthlySummary;
import com.budgetbuddy.dto.TransactionDTO;
import com.budgetbuddy.exception.ResourceNotFoundException;
import com.budgetbuddy.mapper.TransactionMapper;
import com.budgetbuddy.model.Transaction.TransactionType;
import com.budgetbuddy.repository.TransactionRepository;
import com.budgetbuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionMapper transactionMapper;

    @Transactional(readOnly = true)
    public DashboardDTO getDashboard() {
        Long userId = getCurrentUserId();

        // Total income & expense (all time)
        BigDecimal totalIncome = transactionRepository.sumByUserIdAndType(userId, TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumByUserIdAndType(userId, TransactionType.EXPENSE);
        BigDecimal balance = totalIncome.subtract(totalExpense);

        // Savings rate (%)
        BigDecimal savingsRate = BigDecimal.ZERO;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = balance.divide(totalIncome, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        // Expense by category
        Map<String, BigDecimal> expenseByCategory = buildCategoryMap(userId, TransactionType.EXPENSE);
        Map<String, BigDecimal> incomeByCategory = buildCategoryMap(userId, TransactionType.INCOME);

        // Monthly summary (last 12 months)
        LocalDate startDate = LocalDate.now().minusMonths(11).withDayOfMonth(1);
        List<MonthlySummary> monthlySummaries = buildMonthlySummaries(userId, startDate);

        // Recent 5 transactions
        List<TransactionDTO> recentTransactions = transactionMapper.toDTOList(
                transactionRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId)
        );

        return DashboardDTO.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .savingsRate(savingsRate)
                .expenseByCategory(expenseByCategory)
                .incomeByCategory(incomeByCategory)
                .monthlySummaries(monthlySummaries)
                .recentTransactions(recentTransactions)
                .build();
    }

    private Map<String, BigDecimal> buildCategoryMap(Long userId, TransactionType type) {
        List<Object[]> rows = transactionRepository.sumGroupedByCategoryAndType(userId, type);
        Map<String, BigDecimal> map = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String category = row[0].toString();
            BigDecimal amount = (BigDecimal) row[1];
            map.put(category, amount);
        }
        return map;
    }

    private List<MonthlySummary> buildMonthlySummaries(Long userId, LocalDate startDate) {
        List<Object[]> rows = transactionRepository.getMonthlySummary(userId, startDate);
        Map<String, MonthlySummary> summaryMap = new LinkedHashMap<>();

        // Pre-fill all months so gaps appear as zeros
        DateTimeFormatter labelFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        LocalDate cursor = startDate;
        while (!cursor.isAfter(LocalDate.now())) {
            String monthKey = cursor.format(DateTimeFormatter.ofPattern("yyyy-MM"));
            String label = cursor.format(labelFormatter);
            summaryMap.put(monthKey, MonthlySummary.builder()
                    .month(monthKey)
                    .label(label)
                    .income(BigDecimal.ZERO)
                    .expense(BigDecimal.ZERO)
                    .balance(BigDecimal.ZERO)
                    .build());
            cursor = cursor.plusMonths(1);
        }

        // Fill with actual data
        for (Object[] row : rows) {
            String month = (String) row[0];
            BigDecimal income = (BigDecimal) row[1];
            BigDecimal expense = (BigDecimal) row[2];
            if (summaryMap.containsKey(month)) {
                summaryMap.get(month).setIncome(income);
                summaryMap.get(month).setExpense(expense);
                summaryMap.get(month).setBalance(income.subtract(expense));
            }
        }

        return new ArrayList<>(summaryMap.values());
    }

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }
}
