import express from "express";
import cors from "cors";
import winston from "winston";
import dotenv from "dotenv";

//importação das variáveis de ambiente:
dotenv.config();

/* Configurações do winston: */
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level} ${message}`;
});
global.logger = winston.createLogger({
    level: "silly",
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: "server-api.log" })],
    format: combine(label({ label: "server-api" }), timestamp(), myFormat),
});

/* Importar rotas da aplicação */
import processaDadosFinanciamentoRouter from "./routes/ProcessaDadosFinanciamento.route.js";

const app = express();
app.use(express.json());
app.use(cors());

/* Usar as rotas importadas */
app.use("/processa-dados-financiamento", processaDadosFinanciamentoRouter);

app.use((err, req, res, next) => {
    logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    res.status(400).send({ error: err.message });
});

app.listen(3000, () => {
    console.log("API Inicializada");
});

export default app;
