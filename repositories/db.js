import pg from "pg";

async function connect() {
    if (global.connection) {
        return global.connection.connect();
    }
    const pool = new pg.Pool({
        // connection string para acesso da aplicação:
        // connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`,
        // connection string para acesso local (desenvolvimento):
        connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST_EXT}/${process.env.DB_DATABASE}?ssl=true`,
    });
    global.connection = pool;
    return pool.connect();
}

export { connect };
