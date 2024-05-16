import ProcessaDadosFinanciamentoService from "../services/ProcessaDadosFinanciamento.service.js";

async function createProcessaDadosFinanciamento(req, res, next) {
    try {
        let ProcessaDadosFinanciamento = req.body;
        if (!ProcessaDadosFinanciamento.valorFinanciado) {
            throw new Error("Valor financiado é um campo obrigatório.");
        }
        if (!ProcessaDadosFinanciamento.tipoFinanciamento) {
            throw new Error("Tipo de financiamento é um campo obrigatório.");
        }
        if (!ProcessaDadosFinanciamento.taxaDeJuros) {
            throw new Error("Taxa de juros é um campo obrigatório.");
        }
        if (!ProcessaDadosFinanciamento.tipoTaxaDeJuros) {
            throw new Error(
                "Tipo da taxa de juros (mensal / anual) é um campo obrigatório."
            );
        }
        if (!ProcessaDadosFinanciamento.numeroPrestacoes) {
            throw new Error("Número de prestações é um campo obrigatório.");
        }
        if (!ProcessaDadosFinanciamento.indiceCorrecao) {
            throw new Error("Índice de correção é um campo obrigatório.");
        }
        if (!ProcessaDadosFinanciamento.valorPrimeiraParcela) {
            throw new Error(
                "Valor da primeira parcela é um campo obrigatório."
            );
        }
        res.send(
            await ProcessaDadosFinanciamentoService.createProcessaDadosFinanciamento(
                ProcessaDadosFinanciamento
            )
        );
        logger.info(
            `POST /ProcessaDadosFinanciamento - ${JSON.stringify(
                ProcessaDadosFinanciamento
            )}`
        );
    } catch (err) {
        next(err);
    }
}

export default {
    createProcessaDadosFinanciamento,
};
