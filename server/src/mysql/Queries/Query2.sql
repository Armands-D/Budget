-- CALL main_db.get_budget(1, 1);
-- UPDATE main_db.active_categories SET name='Income' WHERE id=2 

-- SET @income = 'INCOME';
-- SET @expense = 'EXPENSE';

-- SET @categoryId = 2;

-- INSERT INTO main_db.active_entries (categoryId, name, amount)
-- VALUES(@categoryId, 'Salary3', 6000);
-- INSERT INTO main_db.active_entries (categoryId, name, amount)
-- VALUES(@categoryId, 'Other3', 600);

# Select all users and their budgets
SELECT
	u.username,
    u.id as userId,
    b.id as budgetId,
    c.id as catId,
    c.type as type,
    c.name as category,
    e.id as entId,
    e.name as entry,
    e.amount as amount
FROM main_db.user as u
    LEFT JOIN main_db.budget AS b ON u.id = b.userId
    LEFT JOIN main_db.active_categories as c ON b.id = c.budgetId
    LEFT JOIN main_db.active_entries as e ON c.id = e.categoryId
;
USE main_db;

SELECT * FROM active_categories;
SELECT * FROM active_entries;
SELECT * FROM budget;
SELECT * FROM refresh_tokens;
SELECT * FROM session_tokens;
SELECT * FROM user;

CALL main_db.refresh_auth_token(1)