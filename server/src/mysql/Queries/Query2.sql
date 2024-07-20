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

SELECT * FROM main_db.active_categories;
SELECT * FROM main_db.active_entries;
SELECT * FROM main_db.budget;
SELECT * FROM main_db.refresh_tokens;
SELECT * FROM main_db.session_tokens;
SELECT * FROM main_db.user;

SET @userId = 1;
SET @hash = (SELECT id FROM main_db.refresh_tokens WHERE user_id = @userId LIMIT 1) + 1;

USE main_db;
CREATE PROCEDURE `refresh_auth_token`(userId INT)
BEGIN
	-- SET @hash = (SELECT id FROM main_db.refresh_tokens WHERE user_id = userId LIMIT 1) + 1;
	DELETE FROM main_db.refresh_tokens WHERE user_id = userId;

	INSERT INTO main_db.refresh_tokens
	(token, user_id)
	VALUES (@hash, userId);
    
    SELECT * FROM main_db.user AS u
	LEFT JOIN main_db.refresh_tokens AS rt ON u.id = rt.user_id
	WHERE u.id = userId;
END
