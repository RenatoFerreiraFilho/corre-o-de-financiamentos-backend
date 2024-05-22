import ProcessaDadosFinanciamentoService from "../services/ProcessaDadosFinanciamento.service.js";

async function createTable(req, res, next) {
    try {
        res.send(await ProcessaDadosFinanciamentoService.createTable());
    } catch (err) {
        next(err);
    }
}
async function createProcessaDadosFinanciamento(req, res, next) {
    try {
        let ProcessaDadosFinanciamento = req.body;
        if (!ProcessaDadosFinanciamento.valorFinanciado) {
            throw new Error("Valor financiado é um campo obrigatório.");
        }
        if (!ProcessaDadosFinanciamento.sistemaFinanciamento) {
            throw new Error("Sistema de financiamento é um campo obrigatório.");
        }
        if (!ProcessaDadosFinanciamento.taxaDeJuros) {
            throw new Error("Taxa de juros é um campo obrigatório.");
        }
        if (!ProcessaDadosFinanciamento.tipoTaxaDeJuros) {
            throw new Error("Tipo da taxa de juros (mensal / anual) é um campo obrigatório.");
        }
        if (!ProcessaDadosFinanciamento.numeroPrestacoes) {
            throw new Error("Número de prestações é um campo obrigatório.");
        }
        if (!ProcessaDadosFinanciamento.indiceCorrecao) {
            throw new Error("Índice de correção é um campo obrigatório.");
        }
        if (!ProcessaDadosFinanciamento.valorPrimeiraParcela) {
            throw new Error("Valor da primeira parcela é um campo obrigatório.");
        }
        res.send(await ProcessaDadosFinanciamentoService.createProcessaDadosFinanciamento(ProcessaDadosFinanciamento));
        logger.info(`POST /ProcessaDadosFinanciamento - ${JSON.stringify(ProcessaDadosFinanciamento)}`);
    } catch (err) {
        next(err);
    }
}

export default {
    createProcessaDadosFinanciamento,
    createTable,
};
