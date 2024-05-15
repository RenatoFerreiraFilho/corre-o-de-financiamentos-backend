import ProcessaDadosFinanciamentoService from "../services/ProcessaDadosFinanciamento.service.js";

async function createProcessaDadosFinanciamento(req, res, next) {
    try {
        let ProcessaDadosFinanciamento = req.body;
        if (!ProcessaDadosFinanciamento.name) {
            /*inserir regras de validação*/
            throw new Error("Configurar campos que serão obrigatórios.");
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
