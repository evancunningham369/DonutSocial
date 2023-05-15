CREATE DATABASE socialdb;

CREATE TABLE account(
    user_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(15),
    hashPass VARCHAR(60),
    followed_users integer[];
    profile_picture bytea;
    UNIQUE username
);

CREATE TABLE post(
    post_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    post_datetime TIMESTAMP,
    user_id int REFERENCES account,
    liked_users integer[];
);
/*
CHANGE COLUMN NAME
*/
ALTER TABLE account
RENAME COLUMN password TO hashPass;
/*
CHANGE COLUMN TYPE
*/
ALTER TABLE account
ALTER COLUMN hashPass TYPE VARCHAR(60);
/*
EMPTY ACCOUNT TABLE
*/
TRUNCATE TABLE someTable RESTART IDENTITY;