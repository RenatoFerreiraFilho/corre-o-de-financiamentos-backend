import { connect } from "./db.js";

async function getIndiceInflacao(indice, data) {
    const conn = await connect();
    try {
        const res = await conn.query(`SELECT ${indice} FROM indices_de_correcao WHERE data = ${data}`);

        return res.rows;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
}

export default {
    getIndiceInflacao,
};
