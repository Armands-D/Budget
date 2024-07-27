CREATE PROCEDURE `refresh_auth_token`(userId INT, token VARCHAR(250))
BEGIN
	INSERT INTO main_db.refresh_tokens
		(token, user_id)
		VALUES (token, userId);
    
  SELECT 
		u.username AS userName,
		u.email,
		u.id AS userId,
		rt.token
 	FROM main_db.user AS u
	LEFT JOIN main_db.refresh_tokens AS rt ON u.id = rt.user_id
	WHERE u.id = userId;
END