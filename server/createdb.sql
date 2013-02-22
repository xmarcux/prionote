/* This is the mysql database setup file for 
   prionote on the server side. 
   Run this file and all existing tables will
   be deleted and recreated. 
*/


/* Remove the existing tables and
   database if they already exists.
*/

DROP DATABASE IF EXISTS prionote;

/* Create new database and new tables */
CREATE DATABASE prionote;
USE prionote;

CREATE TABLE user (
       id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
       uname VARCHAR(255) NOT NULL,
       pword VARCHAR(255) NOT NULL,
       mail VARCHAR(255)
);

CREATE TABLE notes (
       id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
       createId BIGINT UNSIGNED NOT NULL,
       edit BIGINT UNSIGNED,
       text TEXT NOT NULL,
       prio INT NOT NULL,
       userId INT NOT NULL
);

/* Populate user table with values */
INSERT INTO user (uname, pword, mail) VALUES ("marcux", "mpassword", "marcux@marcux.org");
INSERT INTO user (uname, pword, mail) VALUES ("putte", "ppassword", "putte@marcux.org");
INSERT INTO user (uname, pword, mail) VALUES ("svenne", "spassword", "svenne@marcux.org");
INSERT INTO user (uname, pword, mail) VALUES ("lotta", "lpassword", "lotta@marcux.org");
INSERT INTO user (uname, pword, mail) VALUES ("nonotes", "npassword", "nonotes@marcux.org");

/* Populate notes table with values */
INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (123456, 654321, "Remember to water the plants", 1, 1);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (234567, 765432, "I am the best in the universe", 0, 1);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (345678, 876543, "Remember to aply for the job at UPPMAX", 1, 1);

INSERT INTO notes (createId, text, prio, userId)
VALUES (456789, "I love my flowers an they are my verry best friends", 0, 4);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (567890, 0987654, "I have to leave my bike for repair because my pedals are broken", 1, 4);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (10293848, 01928374, "I am my mest friend myself and that is no doubt about that", 2, 4);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (314253, 132435, "The best homepage: http://www.marcux.org it is the best", 1, 4);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (987123, 123987, "I have to write something in here", 3, 4);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (132435, 132435, "My name is Putte", 0, 2);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (231456, 243165, "This is so funny funny, I can barely jast smile", 3, 2);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (321654, 321654, "Jihaa, I wonder if it spells that way", 1, 2);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (432543, 432543, "Cry for the indians, cos they are poor", 0, 3);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (333222, 333222, "I am so sorry tha mankind is horrible.", 0, 3);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (441332, 441332, "This is also a complete meaningless string", 0 , 3);

INSERT INTO notes (createId, edit, text, prio, userId)
VALUES (321098, 321098, "Another one where I do not know what to write", 0 , 3);
