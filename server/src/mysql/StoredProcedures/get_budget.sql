CREATE PROCEDURE `get_budget`(userId INT, budgetId INT)
BEGIN
	SELECT
		u.username,
		u.id as userId,
        b.id as budgetId,
		c.id as categoryId,
        c.type as type,
        c.name as category,
		e.id as entryId,
        e.name as name,
        e.amount as amount 
	FROM main_db.user as u
		LEFT JOIN main_db.budget AS b ON b.userId = u.id
		LEFT JOIN main_db.active_categories as c ON c.budgetId = b.id
		LEFT JOIN main_db.active_entries as e ON e.categoryId = c.id
	WHERE 
    u.id = userId AND
    b.id = budgetId
	;
END