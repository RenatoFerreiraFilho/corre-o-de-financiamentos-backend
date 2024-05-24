import ProcessaDadosFinanciamentoService from "../services/ProcessaDadosFinanciamento.service.js";

async function createProcessaDadosFinanciamento(req, res, next) {
    try {
        let ProcessaDadosFinanciamento = req.body;
        if (!ProcessaDadosFinanciamento.tipoTaxaDeJuros) {
            throw new Error("Tipo da taxa de juros é um campo obrigatório.");
        }
        if (ProcessaDadosFinanciamento.tipoTaxaDeJuros !== "anual" && ProcessaDadosFinanciamento.tipoTaxaDeJuros !== "mensal") {
            throw new Error("Tipo da taxa de juros informado inválido.");
        }
        if (!ProcessaDadosFinanciamento.taxaDeJuros) {
            throw new Error("Taxa de juros é um campo obrigatório.");
        }
        if (!isNumeric(ProcessaDadosFinanciamento.taxaDeJuros)) {
            throw new Error("Taxa de juros inválida.");
        }
        if (!ProcessaDadosFinanciamento.sistemaFinanciamento) {
            throw new Error("Sistema de financiamento é um campo obrigatório.");
        }
        if (ProcessaDadosFinanciamento.sistemaFinanciamento !== "price" && ProcessaDadosFinanciamento.sistemaFinanciamento !== "sac") {
            throw new Error("Sistema de financiamento informado inválido.");
        }
        if (!ProcessaDadosFinanciamento.numeroPrestacoes) {
            throw new Error("Número de prestações é um campo obrigatório.");
        }
        if (!isNumeric(ProcessaDadosFinanciamento.numeroPrestacoes)) {
            throw new Error("Número de prestações inválido.");
        }
        if (!ProcessaDadosFinanciamento.valorPrimeiraParcela) {
            throw new Error("Valor da primeira parcela é um campo obrigatório.");
        }
        if (!isNumeric(ProcessaDadosFinanciamento.valorPrimeiraParcela)) {
            throw new Error("Valor da primeira parcela inválido.");
        }
        if (!ProcessaDadosFinanciamento.indiceCorrecao) {
            throw new Error("Índice de correção é um campo obrigatório.");
        }
        if (ProcessaDadosFinanciamento.indiceCorrecao !== "ipca" && ProcessaDadosFinanciamento.indiceCorrecao !== "igpm" && ProcessaDadosFinanciamento.indiceCorrecao !== "incc") {
            throw new Error("Índice de correção informado inválido.");
        }

        res.send(await ProcessaDadosFinanciamentoService.createProcessaDadosFinanciamento(ProcessaDadosFinanciamento));
        logger.info(`POST /ProcessaDadosFinanciamento - ${JSON.stringify(ProcessaDadosFinanciamento)}`);
    } catch (err) {
        next(err);
    }
}

function isNumeric(value) {
    return typeof value === "number" && !Number.isNaN(value);
}

export default {
    createProcessaDadosFinanciamento,
};
