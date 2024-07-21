**Tags:**
#MySQL #Database 
*version: 8.0.36*

# Installation
Installing MySQL on Linux Using the MySQL APT Repository
[Installation Link](https://dev.mysql.com/doc/refman/8.3/en/linux-installation-apt-repo.htmlk()

1. Install APT source
	- Let's you choose which MySQL version you want to install
	- Maintains version comparability

 ```
sudo apt-get install \
	mysql-server \
	install mysql-workbench-community \
	libmysqlclient21
```

## Test Installation
[Doc](https://dev.mysql.com/doc/refman/8.3/en/testing-server.html)

# User Setup
Root is the default user however they cannot connect to the database via workbench without a password being set. 

**Setting User Password** [#WORKED]
https://stackoverflow.com/questions/41645309/mysql-error-access-denied-for-user-rootlocalhost

**Setting User Password MySQL Doc**
Didn't work for me
https://dev.mysql.com/doc/refman/8.0/en/default-privileges.html

**Setting User Password**
Older MySQL versions, still good explanations
https://docs.rackspace.com/docs/install-mysql-server-on-the-ubuntu-operating-system

## List Users
If authentication string is populated password was set.
`SELECT User, Host, authentication_string, plugin FROM mysql.user;`

## Connecting to Database
**Error:** org.desktop.secret was not provided
`sudo apt install gnome-keyring`
### Client and Server Mismatch
If the client and server versions are mismatched, make sure you're connecting using the correct socket.
Connection > Advanced > Other 
```sql
socket=/var/run/mysqld/mysqld.sock
```

# Table Definition

```sql
SHOW CREATE TABLE main_db.Persons;
```

**Output
```sql
CREATE TABLE Persons (
	PersonID int DEFAULT NULL,
	LastName varchar(255) DEFAULT NULL,
	FirstName varchar(255) DEFAULT NULL,
	Address varchar(255) DEFAULT NULL,
	City varchar(255) DEFAULT NULL,
	ex int DEFAULT NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'
```

# SQL Data Files
[SQL Docs](https://dev.mysql.com/doc/refman/8.0/en/data-directory.html|)
`datdir` is where MySQL stores Database related data files, stored procedures, tables, etc...

You can query to find this directory.
```sql
SHOW VARIABLES WHERE Variable_Name LIKE "%dir" ;
```

**Output
![[Pasted image 20240721224716.png]]

# Delimiter
MySQL stored procedures need the delimiter temporarily changed to parse correctly. 
