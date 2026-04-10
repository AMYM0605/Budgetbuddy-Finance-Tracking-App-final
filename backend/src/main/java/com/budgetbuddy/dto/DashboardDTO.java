package com.budgetbuddy.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private BigDecimal savingsRate;

    private List<MonthlySummary> monthlySummaries;
    private Map<String, BigDecimal> expenseByCategory;
    private Map<String, BigDecimal> incomeByCategory;
    private List<TransactionDTO> recentTransactions;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlySummary {
        private String month;   // e.g. "2024-01"
        private String label;   // e.g. "Jan 2024"
        private BigDecimal income;
        private BigDecimal expense;
        private BigDecimal balance;
    }
}
