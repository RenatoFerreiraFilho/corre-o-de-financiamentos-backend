import { connect } from "./db.js";

async function insertProcessaDadosFinanciamento(ProcessaDadosFinanciamento) {
    const conn = await connect();
    try {
        /* editar query: */
        const sql = "INSERT INTO logs (name, cpf) VALUES ($1, $2) RETURNING *";
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

async function getIndiceInflacao(indice, data) {
    const conn = await connect();
    try {
        const res = await conn.query(
            `SELECT ${indice} FROM indices WHERE data = ${data}`
        );

        return res.rows;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
}

export default {
    insertProcessaDadosFinanciamento,
    getIndiceInflacao,
};
