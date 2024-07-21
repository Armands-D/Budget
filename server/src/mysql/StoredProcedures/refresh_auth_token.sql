CREATE PROCEDURE `refresh_auth_token`(userId INT)
BEGIN
	SET @token = CAST( FLOOR ( RAND() * 60000000000) AS CHAR(150) );
	DELETE FROM main_db.refresh_tokens WHERE user_id = userId;

	INSERT INTO main_db.refresh_tokens
		(token, user_id)
		VALUES (@token, userId);
    
    SELECT
			u.username AS userName,
			u.email,
			u.id AS userId,
			rt.token
		FROM main_db.user AS u
			LEFT JOIN main_db.refresh_tokens AS rt ON u.id = rt.user_id
			WHERE u.id = userId;
END