import pg from "pg";

async function connect() {
    if (global.connection) {
        return global.connection.connect();
    }
    const pool = new pg.Pool({
        /* Editar connectionString: */
        connectionString: "postgres://bdcorrecao_user:SRkecj0V46vNoryCcFZEGXyzYnYvDKi9@dpg-cp6r936v3ddc73fp1ocg-a/bdcorrecao",
    });
    global.connection = pool;
    return pool.connect();
}

export { connect };
