import ProcessaDadosFinanciamentoRepository from "../repositories/ProcessaDadosFinanciamento.repository.js";

async function createProcessaDadosFinanciamento(ProcessaDadosFinanciamento) {
    //valorFinanciado
    //taxaDeJuros
    //tipoTaxaDeJuros
    //numeroPrestacoes
    //indiceCorrecao
    //valorPrimeiraParcela
    const parcelaCincoAnosAtras
    const valorPagoCincoAnosAtras// mar/19 - mar/24
    const saldoDevedorCincoAnosAtras

    const parcelaDezAnosAtras
    const valorPagoDezAnosAtras
    const saldoDevedorDezAnosAtras

    const parcelaQuinzeAnosAtras
    const valorPagoQuinzeAnosAtras
    const saldoDevedorQuinzeAnosAtras

    const indiceCorrecaoAtual = await ProcessaDadosFinanciamentoRepository.getIndiceInflacao(ProcessaDadosFinanciamento.indiceCorrecao, "2024-03-01")

    const indiceCorrecaoBaseCincoAnos = await ProcessaDadosFinanciamentoRepository.getIndiceInflacao(ProcessaDadosFinanciamento.indiceCorrecao, "2019-03-01")
    const inflacaoAcumuladaCincoAnos = indiceCorrecaoAtual / indiceCorrecaoBaseCincoAnos

    const indiceCorrecaoBaseDezAnos = await ProcessaDadosFinanciamentoRepository.getIndiceInflacao(ProcessaDadosFinanciamento.indiceCorrecao, "2019-03-01")
    const inflacaoAcumuladaDezAnos = indiceCorrecaoAtual / indiceCorrecaoBaseDezAnos

    const indiceCorrecaoBaseQuinzeAnos = await ProcessaDadosFinanciamentoRepository.getIndiceInflacao(ProcessaDadosFinanciamento.indiceCorrecao, "2019-03-01")
    const inflacaoAcumuladaQuinzeAnos = indiceCorrecaoAtual / indiceCorrecaoBaseQuinzeAnos

    if (tipoFinanciamento === "PRICE"){
        parcelaCincoAnosAtras = ProcessaDadosFinanciamento.valorPrimeiraParcela * inflacaoAcumuladaCincoAnos
        parcelaDezAnosAtras = ProcessaDadosFinanciamento.valorPrimeiraParcela * inflacaoAcumuladaDezAnos
        parcelaQuinzeAnosAtras = ProcessaDadosFinanciamento.valorPrimeiraParcela * inflacaoAcumuladaQuinzeAnos
    }
    if (tipoFinanciamento === "SAC"){

    }


    return await ProcessaDadosFinanciamentoRepository.insertProcessaDadosFinanciamento(
        ProcessaDadosFinanciamento
    );
}

export default {
    createProcessaDadosFinanciamento,
};
