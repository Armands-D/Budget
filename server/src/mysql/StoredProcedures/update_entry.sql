DELIMITER //
DROP PROCEDURE update_entry;
CREATE PROCEDURE update_entry(entryId INT, name VARCHAR(45), amount DECIMAL(12,2))
BEGIN
	UPDATE main_db.active_entries
		SET name = name, amount = amount
	WHERE id = entryId;
END// 
