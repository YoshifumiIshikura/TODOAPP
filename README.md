# TODOAPP TEAM B

```SQL
CREATE TABLE IF NOT EXISTS todos
(
	id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
	title VARCHAR(255) NOT NULL,
	state BOOL NOT NULL DEFAULT false,
  	PRIMARY KEY (id)
);
```
