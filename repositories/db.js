import pg from "pg";

async function connect() {
    if (global.connection) {
        return global.connection.connect();
    }
    const pool = new pg.Pool({
        /* Editar connectionString: */
        connectionString: "postgres://xcmplidk:CRIARBD",
    });
    global.connection = pool;
    return pool.connect();
}

export { connect };
