# 💰 Budget Buddy – Expense Management System

A full-stack personal finance tracker built with **Spring Boot** + **React**.

---

## 🏗️ Architecture

```
budget-buddy/
├── backend/               # Spring Boot (Java 17)
│   └── src/main/java/com/budgetbuddy/
│       ├── controller/    # REST controllers
│       ├── service/       # Business logic
│       ├── repository/    # Spring Data JPA repos
│       ├── model/         # JPA entities
│       ├── dto/           # Data Transfer Objects
│       ├── mapper/        # MapStruct mappers
│       ├── security/      # JWT filter + utils
│       ├── config/        # SecurityConfig, CORS
│       └── exception/     # Global error handling
├── frontend/              # React + Vite
│   └── src/
│       ├── pages/         # Login, Register, Dashboard, Transactions, Form
│       ├── components/    # Layout, charts, UI atoms
│       ├── services/      # Axios API layer
│       ├── context/       # Auth context
│       └── utils/         # Helpers
└── render.yaml            # Render deployment config
```

---

## ⚡ Quick Start

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+
- MySQL 8+

### 1. Database
```sql
-- Run backend/src/main/resources/schema.sql
mysql -u root -p < backend/src/main/resources/schema.sql
```

### 2. Backend
```bash
cd backend

# Set environment variables (or edit application.properties)
export DB_URL=jdbc:mysql://localhost:3306/budget_buddy
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

# Run
mvn spring-boot:run
# → http://localhost:8080
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
# Edit VITE_API_URL if needed (default: /api uses Vite proxy to localhost:8080)

npm install
npm run dev
# → http://localhost:5173
```

---

## 🔑 API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, receive JWT |

**Register Request**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "currency": "USD"
}
```

**Login Request**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Auth Response (both)**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "tokenType": "Bearer",
    "user": { "id": 1, "fullName": "Jane Doe", "email": "jane@example.com", "currency": "USD" }
  }
}
```

### Transactions *(JWT required: `Authorization: Bearer <token>`)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions?page=0&size=10` | Paginated list |
| GET | `/api/transactions?all=true` | Full list (no pagination) |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/{id}` | Update transaction |
| DELETE | `/api/transactions/{id}` | Delete transaction |

**Transaction Body**
```json
{
  "title": "Monthly Salary",
  "amount": 5000.00,
  "type": "INCOME",
  "category": "SALARY",
  "description": "November salary",
  "transactionDate": "2024-11-01"
}
```

**Types:** `INCOME` | `EXPENSE`

**Income Categories:** `SALARY` `FREELANCE` `INVESTMENT` `GIFT` `OTHER_INCOME`

**Expense Categories:** `FOOD` `TRANSPORT` `SHOPPING` `HOUSING` `HEALTHCARE` `ENTERTAINMENT` `EDUCATION` `UTILITIES` `TRAVEL` `OTHER_EXPENSE`

### Dashboard *(JWT required)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Analytics summary |

**Response**
```json
{
  "success": true,
  "data": {
    "totalIncome": 10000.00,
    "totalExpense": 6400.00,
    "balance": 3600.00,
    "savingsRate": 36.00,
    "monthlySummaries": [
      { "month": "2024-01", "label": "Jan 2024", "income": 5000, "expense": 3200, "balance": 1800 }
    ],
    "expenseByCategory": { "FOOD": 800.00, "TRANSPORT": 200.00 },
    "incomeByCategory":  { "SALARY": 10000.00 },
    "recentTransactions": [...]
  }
}
```

---

## 🚀 Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → **Blueprint**
3. Connect your repo → Render reads `render.yaml` automatically
4. Add a **MySQL** database in Render, update `render.yaml` connection string
5. Deploy!

### Environment Variables (Backend)

| Variable | Description |
|----------|-------------|
| `DB_URL` | MySQL JDBC URL |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | 256-bit hex secret (generate with `openssl rand -hex 32`) |
| `JWT_EXPIRATION` | Token TTL in ms (default: 86400000 = 24h) |
| `PORT` | Server port (Render sets this automatically) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth | JWT (jjwt 0.12), BCrypt |
| ORM | Hibernate, MapStruct |
| Database | MySQL 8 |
| Frontend | React 18, Vite, React Router v6 |
| HTTP | Axios |
| Charts | Recharts |
| Deployment | Render |
