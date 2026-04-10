-- ============================================================
-- Budget Buddy – Database Schema (MySQL 8.0+)
-- ============================================================

CREATE DATABASE IF NOT EXISTS budget_buddy
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE budget_buddy;

-- ────────────────────────────────────────────────
-- TABLE: users
-- ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    full_name   VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL,
    password    VARCHAR(255)    NOT NULL,
    currency    VARCHAR(10)     NOT NULL DEFAULT 'USD',
    created_at  DATETIME(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)              DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX idx_user_email ON users (email);

-- ────────────────────────────────────────────────
-- TABLE: transactions
-- ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    title               VARCHAR(200)    NOT NULL,
    amount              DECIMAL(15, 2)  NOT NULL,
    type                ENUM('INCOME','EXPENSE') NOT NULL,
    category            ENUM(
                            'SALARY','FREELANCE','INVESTMENT','GIFT','OTHER_INCOME',
                            'FOOD','TRANSPORT','SHOPPING','HOUSING','HEALTHCARE',
                            'ENTERTAINMENT','EDUCATION','UTILITIES','TRAVEL','OTHER_EXPENSE'
                        ) NOT NULL,
    description         VARCHAR(500),
    transaction_date    DATE            NOT NULL,
    user_id             BIGINT          NOT NULL,
    created_at          DATETIME(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)              DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    CONSTRAINT pk_transactions PRIMARY KEY (id),
    CONSTRAINT fk_transactions_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_transaction_user     ON transactions (user_id);
CREATE INDEX idx_transaction_date     ON transactions (transaction_date);
CREATE INDEX idx_transaction_type     ON transactions (type);
CREATE INDEX idx_transaction_category ON transactions (category);
-- Composite index for common query pattern
CREATE INDEX idx_transaction_user_date ON transactions (user_id, transaction_date DESC);
