package com.budgetbuddy.controller;

import com.budgetbuddy.dto.ApiResponse;
import com.budgetbuddy.dto.DashboardDTO;
import com.budgetbuddy.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * GET /api/dashboard
     * Response: 200 {
     *   "success": true,
     *   "data": {
     *     "totalIncome": 5000.00,
     *     "totalExpense": 3200.00,
     *     "balance": 1800.00,
     *     "savingsRate": 36.00,
     *     "monthlySummaries": [...],
     *     "expenseByCategory": { "FOOD": 800.00, ... },
     *     "incomeByCategory":  { "SALARY": 5000.00, ... },
     *     "recentTransactions": [...]
     *   }
     * }
     */
    @GetMapping
    public ResponseEntity<ApiResponse<DashboardDTO>> getDashboard() {
        DashboardDTO dashboard = dashboardService.getDashboard();
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}
