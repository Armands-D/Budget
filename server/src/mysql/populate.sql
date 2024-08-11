
INSERT INTO main_db.user (username, email, password)
VALUES (armands, a.d@g.com, armands);

SET @userId = LAST_INSERT_ID();

INSERT INTO main_db.budget (userId)
VALUES (@userId);

SET @budgetId = LAST_INSERT_ID();
SET @income = 'INCOME';
SET @expense = 'EXPENSE';

INSERT INTO main_db.active_categories (budgetId, name, type)
VALUES(@budgetId, 'House Hold', @income);

SET @categoryId = LAST_INSERT_ID();

INSERT INTO main_db.active_entries (categoryId, name, amount)
VALUES(@categoryId, 'Salary', 2000);
INSERT INTO main_db.active_entries (categoryId, name, amount)
VALUES(@categoryId, 'Other', 200);

# Select all users and their budgets
SELECT u.username, u.id as userId, b.id as budgetId, c.type as type, c.name as category, e.name as entry, e.amount as amount  FROM main_db.user as u
    LEFT JOIN main_db.budget AS b ON b.userId = u.id
    LEFT JOIN main_db.active_categories as c ON c.budgetId = b.id
    LEFT JOIN main_db.active_entries as e ON e.categoryId = c.id
;
