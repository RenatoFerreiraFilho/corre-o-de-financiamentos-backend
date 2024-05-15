import { connect } from "./db.js";

async function insertProcessaDadosFinanciamento(ProcessaDadosFinanciamento) {
    const conn = await connect();
    try {
        /* editar query: */
        const sql =
            "INSERT INTO clients (name, cpf) VALUES ($1, $2) RETURNING *";
        /* inserir campos do banco de dados: */
        const values = [
            ProcessaDadosFinanciamento.name,
            ProcessaDadosFinanciamento.cpf,
        ];

        const res = await conn.query(sql, values);
        return res.rows[0];
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
}

async function getProcessaDadosFinanciamentos() {
    const conn = await connect();
    try {
        /* editar query: */
        const res = await conn.query("SELECT * FROM clients");

        return res.rows;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
}

export default {
    insertProcessaDadosFinanciamento,
    getProcessaDadosFinanciamentos,
};
