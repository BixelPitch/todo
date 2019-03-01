![Login](/screenshots/screenshot_login.png?raw=true "Login Screen")
![Dashboard](/screenshots/screenshot_dashboard.png?raw=true "Dashboard Screen")

# TODO
A simple application for demo purposes, which manages To-Do-Lists for registered Users.

## Prerequisites
- Node.js
- MySQL Server of your choice (e.g. MariaDB)
- Already created database and a user, which has permissions on this database

## Local deployment
- Clone this repository
- Run ````npm i```` to install the dependencies
- Run ````npm start```` to start the application

## Deployment with docker
- Run ````docker run --name todo -d bixelpitch/todo -p 3000:3000````

## Application parameters
These are the default application parameters. If something does not fit to your current setup, just override them with environment variables. It is highly recommended, that you at least set the ````SECRET````, ````MYSQL_PASSWORD```` and the ````NODE_ENV````, if you run the app in production.

| Environment Variable   | Default                     | Description                                         |
|:-----------------------|:----------------------------|:----------------------------------------------------|
| NODE_ENV               | "development"               | Set it to ````development```` or ````production```` |
| MYSQL_DB               | "todo"                      | database name                                       |
| MYSQL_HOST             | "127.0.0.1"                 | the IP of the database server                       |
| MYSQL_PORT             | 3306                        | the port of the database server                     |
| MYSQL_USER             | "todo_user"                 | the username of the database user                   |
| MYSQL_PASSWORD         | "todo"                      | the password of the user                            |
| MYSQL_CONNECTION_LIMIT | 100                         | max open connections to the database                |
| PORT                   | 3000                        | the port on which the app listens                   |
| SECRET                 | "SHINIGAMI ONLY EAT APPLES" | the session secret                                  |
