import { connect } from "./db.js";

async function createTable() {
    const conn = await connect();
    try {
        const sql = `
        CREATE TABLE indices_de_correcao (
            data_calendario DATE,
            IPCA NUMERIC(10, 2),
            IGPM NUMERIC(10, 2),
            INCC NUMERIC(10, 2)
        );
        `;
        const res = await conn.query(sql);
        return res;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
}
async function insertProcessaDadosFinanciamento(ProcessaDadosFinanciamento) {
    const conn = await connect();
    try {
        /* editar query: */
        const sql = "INSERT INTO logs (name, cpf) VALUES ($1, $2) RETURNING *";
        /* inserir campos do banco de dados: */
        const values = [ProcessaDadosFinanciamento.name, ProcessaDadosFinanciamento.cpf];

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
        const res = await conn.query(`SELECT ${indice} FROM indices WHERE data = ${data}`);

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
    createTable,
};
