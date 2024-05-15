import ProcessaDadosFinanciamentoRepository from "../repositories/ProcessaDadosFinanciamento.repository.js";

async function createProcessaDadosFinanciamento(ProcessaDadosFinanciamento) {
    return await ProcessaDadosFinanciamentoRepository.insertProcessaDadosFinanciamento(
        ProcessaDadosFinanciamento
    );
}

export default {
    createProcessaDadosFinanciamento,
};
