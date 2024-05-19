import ProcessaDadosFinanciamentoRepository from "../repositories/ProcessaDadosFinanciamento.repository.js";

async function createProcessaDadosFinanciamento(ProcessaDadosFinanciamento) {
    //sistemaFinanciamento
    //taxaDeJuros
    //tipoTaxaDeJuros
    //numeroPrestacoes
    //indiceCorrecao
    //valorPrimeiraParcela
    const taxaDeJurosMensal =
        ProcessaDadosFinanciamento.tipoTaxaDeJuros === "ANUAL"
            ? mensalizaTaxaAnual(ProcessaDadosFinanciamento.taxaDeJuros)
            : ProcessaDadosFinanciamento.taxaDeJuros;

    const mesInicialFluxoCincoAnos = calculaMesInicial(5);
    const mesInicialFluxoDezAnos = calculaMesInicial(10);
    const mesInicialFluxoQuinzeAnos = calculaMesInicial(15);
    const valorFinanciado = calculaValorFinanciado(
        ProcessaDadosFinanciamento.sistemaFinanciamento,
        taxaDeJurosMensal,
        ProcessaDadosFinanciamento.numeroPrestacoes,
        ProcessaDadosFinanciamento.valorPrimeiraParcela
    );

    const fluxoFinanciamentoCincoAnos = geraFluxoFinanciamento(
        mesInicialFluxoCincoAnos,
        ProcessaDadosFinanciamento.sistemaFinanciamento,
        taxaDeJurosMensal,
        ProcessaDadosFinanciamento.numeroPrestacoes,
        ProcessaDadosFinanciamento.indiceCorrecao,
        ProcessaDadosFinanciamento.valorPrimeiraParcela
    );
    const fluxoFinanciamentoDezAnos = geraFluxoFinanciamento(
        mesInicialFluxoDezAnos,
        ProcessaDadosFinanciamento.sistemaFinanciamento,
        taxaDeJurosMensal,
        ProcessaDadosFinanciamento.numeroPrestacoes,
        ProcessaDadosFinanciamento.indiceCorrecao,
        ProcessaDadosFinanciamento.valorPrimeiraParcela
    );
    const fluxoFinanciamentoQuinzeAnos = geraFluxoFinanciamento(
        mesInicialFluxoQuinzeAnos,
        ProcessaDadosFinanciamento.sistemaFinanciamento,
        taxaDeJurosMensal,
        ProcessaDadosFinanciamento.numeroPrestacoes,
        ProcessaDadosFinanciamento.indiceCorrecao,
        ProcessaDadosFinanciamento.valorPrimeiraParcela
    );

    //Resultados para cinco anos:
    const parcelaCincoAnosAtras = retornaParcelaNaData(fluxoFinanciamentoCincoAnos, "2024-03-01");
    const valorPagoCincoAnosAtras = retornaSomaValorPagoNoIntervalo(
        fluxoFinanciamentoCincoAnos,
        mesInicialFluxoCincoAnos,
        "2024-03-01"
    );
    const saldoDevedorCincoAnosAtras = retornaSaldoDevedorNaData(fluxoFinanciamentoCincoAnos, "2024-03-01");

    //Resultados para dez anos:
    const parcelaDezAnosAtras = retornaParcelaNaData(fluxoFinanciamentoDezAnos, "2024-03-01");
    const valorPagoDezAnosAtras = retornaSomaValorPagoNoIntervalo(
        fluxoFinanciamentoDezAnos,
        mesInicialFluxoDezAnos,
        "2024-03-01"
    );
    const saldoDevedorDezAnosAtras = retornaSaldoDevedorNaData(fluxoFinanciamentoDezAnos, "2024-03-01");

    //Resultados para quinze anos:
    const parcelaQuinzeAnosAtras = retornaParcelaNaData(fluxoFinanciamentoQuinzeAnos, "2024-03-01");
    const valorPagoQuinzeAnosAtras = retornaSomaValorPagoNoIntervalo(
        fluxoFinanciamentoQuinzeAnos,
        mesInicialFluxoDezAnos,
        "2024-03-01"
    );
    const saldoDevedorQuinzeAnosAtras = retornaSaldoDevedorNaData(fluxoFinanciamentoQuinzeAnos, "2024-03-01");

    return {
        valorFinanciado: valorFinanciado,
        parcelaCincoAnosAtras: parcelaCincoAnosAtras,
        valorPagoCincoAnosAtras: valorPagoCincoAnosAtras,
        saldoDevedorCincoAnosAtras: saldoDevedorCincoAnosAtras,
        parcelaDezAnosAtras: parcelaDezAnosAtras,
        valorPagoDezAnosAtras: valorPagoDezAnosAtras,
        saldoDevedorDezAnosAtras: saldoDevedorDezAnosAtras,
        parcelaQuinzeAnosAtras: parcelaQuinzeAnosAtras,
        valorPagoQuinzeAnosAtras: valorPagoQuinzeAnosAtras,
        saldoDevedorQuinzeAnosAtras: saldoDevedorQuinzeAnosAtras,
    };
}

function mensalizaTaxaAnual(taxaAnual) {
    return (1 + taxaAnual) ** (1 / 12) - 1;
}

export default {
    createProcessaDadosFinanciamento,
};
