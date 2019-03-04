module.exports = {
    MYSQL_DB: process.env.MYSQL_DB || 'todo',
    MYSQL_HOST: process.env.MYSQL_HOST || '127.0.0.1',
    MYSQL_PORT: parseInt(process.env.MYSQL_PORT) || 3306,
    MYSQL_USER: process.env.MYSQL_USER || 'todo_user',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || 'todo',
    MYSQL_CONNECTION_LIMIT: process.env.MYSQL_CONNECTION_LIMIT || 100,
    PORT: parseInt(process.env.PORT) || 3000,
    SECRET: process.env.SECRET || 'SHINIGAMI ONLY EAT APPLES',
    SECURE: process.env.SECURE === 'true' || process.env.SECURE === 'True' || false
}
