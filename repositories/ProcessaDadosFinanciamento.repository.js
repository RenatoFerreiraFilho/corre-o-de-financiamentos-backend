import { connect } from "./db.js";

async function getIndiceInflacao(indice) {
    const conn = await connect();
    try {
        const res = await conn.query(`SELECT ${indice}, date  FROM indices`);
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
