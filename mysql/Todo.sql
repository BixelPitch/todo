CREATE TABLE IF NOT EXISTS `TODOS`(
    TODO_ID     INT(11)     NOT NULL 	AUTO_INCREMENT,
    TEXT        TEXT        NOT NULL,
    DONE        BOOLEAN     NOT NULL    DEFAULT 0,
    USER        INT(11)		NOT NULL,
    CREATED     TIMESTAMP   NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    UPDATED     TIMESTAMP   NOT NULL    DEFAULT CURRENT_TIMESTAMP   ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (TODO_ID),
    INDEX (USER),
    FOREIGN KEY (USER)
    	REFERENCES USERS(USER_ID)
    	ON UPDATE CASCADE
    	ON DELETE CASCADE
) ENGINE=InnoDB;