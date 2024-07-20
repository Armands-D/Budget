CREATE DEFINER=`admin`@`localhost` PROCEDURE `refresh_auth_token`(userId INT)
BEGIN
  DECLARE token VARCHAR(150);
	SET token = (SELECT id FROM main_db.refresh_tokens WHERE user_id = @userId LIMIT 1) + 1;
	DELETE FROM main_db.refresh_tokens WHERE user_id = userId;

	INSERT INTO main_db.refresh_tokens
		(token, user_id)
		VALUES (token, userId);
    
    SELECT * FROM main_db.user AS u
		LEFT JOIN main_db.refresh_tokens AS rt ON u.id = rt.user_id
		WHERE u.id = userId;
END