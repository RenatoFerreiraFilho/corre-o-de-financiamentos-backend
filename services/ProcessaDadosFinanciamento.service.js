import ProcessaDadosFinanciamentoRepository from "../repositories/ProcessaDadosFinanciamento.repository.js";

async function createProcessaDadosFinanciamento(ProcessaDadosFinanciamento) {
    //sistemaFinanciamento
    //taxaDeJuros
    //tipoTaxaDeJuros
    //numeroPrestacoes
    //indiceCorrecao
    //valorPrimeiraParcela
    const taxaDeJurosMensal =
        ProcessaDadosFinanciamento.tipoTaxaDeJuros === "ANUAL" ? mensalizaTaxaAnual(ProcessaDadosFinanciamento.taxaDeJuros) : ProcessaDadosFinanciamento.taxaDeJuros;

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
        valorFinanciado,
        mesInicialFluxoCincoAnos,
        ProcessaDadosFinanciamento.sistemaFinanciamento,
        taxaDeJurosMensal,
        ProcessaDadosFinanciamento.numeroPrestacoes,
        ProcessaDadosFinanciamento.indiceCorrecao,
        ProcessaDadosFinanciamento.valorPrimeiraParcela
    );
    const fluxoFinanciamentoDezAnos = geraFluxoFinanciamento(
        valorFinanciado,
        mesInicialFluxoDezAnos,
        ProcessaDadosFinanciamento.sistemaFinanciamento,
        taxaDeJurosMensal,
        ProcessaDadosFinanciamento.numeroPrestacoes,
        ProcessaDadosFinanciamento.indiceCorrecao,
        ProcessaDadosFinanciamento.valorPrimeiraParcela
    );
    const fluxoFinanciamentoQuinzeAnos = geraFluxoFinanciamento(
        valorFinanciado,
        mesInicialFluxoQuinzeAnos,
        ProcessaDadosFinanciamento.sistemaFinanciamento,
        taxaDeJurosMensal,
        ProcessaDadosFinanciamento.numeroPrestacoes,
        ProcessaDadosFinanciamento.indiceCorrecao,
        ProcessaDadosFinanciamento.valorPrimeiraParcela
    );

    //Resultados para cinco anos:
    const parcelaCincoAnosAtras = retornaParcelaNaData(fluxoFinanciamentoCincoAnos, "2024-03-01");
    const valorPagoCincoAnosAtras = retornaSomaValorPagoNoIntervalo(fluxoFinanciamentoCincoAnos, mesInicialFluxoCincoAnos, "2024-03-01");
    const saldoDevedorCincoAnosAtras = retornaSaldoDevedorNaData(fluxoFinanciamentoCincoAnos, "2024-03-01");

    //Resultados para dez anos:
    const parcelaDezAnosAtras = retornaParcelaNaData(fluxoFinanciamentoDezAnos, "2024-03-01");
    const valorPagoDezAnosAtras = retornaSomaValorPagoNoIntervalo(fluxoFinanciamentoDezAnos, mesInicialFluxoDezAnos, "2024-03-01");
    const saldoDevedorDezAnosAtras = retornaSaldoDevedorNaData(fluxoFinanciamentoDezAnos, "2024-03-01");

    //Resultados para quinze anos:
    const parcelaQuinzeAnosAtras = retornaParcelaNaData(fluxoFinanciamentoQuinzeAnos, "2024-03-01");
    const valorPagoQuinzeAnosAtras = retornaSomaValorPagoNoIntervalo(fluxoFinanciamentoQuinzeAnos, mesInicialFluxoDezAnos, "2024-03-01");
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

function calculaMesInicial(numeroDeAnosAtras) {
    //Futuramente, implementar lógica em que a data atual fique dinâmica.
    //Para isso, será necessário abastecer o Banco de Dados dos índices de inflação dinamicamente
    if (numeroDeAnosAtras === 5) {
        return "2019-03-01";
    }
    if (numeroDeAnosAtras === 10) {
        return "2014-03-01";
    }
    if (numeroDeAnosAtras === 15) {
        return "2009-03-01";
    }
}

function calculaValorFinanciado(sistemaDeFinanciamento, taxaDeJuros, numeroPrestacoes, valorPrimeiraParcela) {
    if (sistemaDeFinanciamento === "PRICE") {
        return (valorPrimeiraParcela * ((1 + taxaDeJuros) ** numeroPrestacoes - 1)) / ((1 + taxaDeJuros) ** numeroPrestacoes * taxaDeJuros);
    }
    if (sistemaDeFinanciamento === "SAC") {
        return valorPrimeiraParcela / (1 / numeroPrestacoes + taxaDeJuros);
    }
}

async function geraFluxoFinanciamento(valorFinanciado, mesInicialDoFluxo, sistemaFinanciamento, taxaDeJuros, numeroPrestacoes, indiceDeCorrecao, valorPrimeiraParcela) {
    const fluxoFinanciamento = [];
    var periodoN, periodoCalendario, boolCorrige, parcelaMesAnterior, indiceDoMes, correcaoPeriodo, correcaoLatente, parcelaMesCorrente;
    var fluxo_saldoInicialPeriodo,
        fluxo_correcaoPeriodo,
        fluxo_saldoParcialCorrigidoPeriodo,
        fluxo_jurosIncorridosPeriodo,
        fluxo_saldoParcialCorrigidoComJurosPeriodo,
        fluxo_jurosPagosPeriodo,
        fluxo_amortizacaoPeriodo,
        fluxo_saldoFinalPeriodo;
    for (let i = 0; i < numeroPrestacoes; i++) {
        periodoN = 0;
        periodoCalendario = i === 0 ? mesInicialDoFluxo : incrementaUmMesCalendario(periodoCalendario);
        boolCorrige = i === 0 ? false : true;
        parcelaMesAnterior = i === 0 ? valorPrimeiraParcela : parcelaMesCorrente;
        indiceDoMes = await ProcessaDadosFinanciamentoRepository.getIndiceInflacao(indiceDeCorrecao, periodoCalendario);
        correcaoPeriodo = i === 0 ? 0 : indiceDoMes / indiceDoMesAnterior - 1;
        correcaoLatente = i === 0 ? 0 : boolCorrigeMesAnterior === false ? (1 + correcaoLatenteMesAnterior) * (1 + correcaoPeriodo) - 1 : correcaoPeriodo;
        fluxo_saldoInicialPeriodo = i === 0 ? valorFinanciado : fluxo_saldoFinalPeriodo;
        fluxo_correcaoPeriodo = boolCorrige ? fluxo_saldoInicialPeriodo * correcaoLatente : 0;
        fluxo_saldoParcialCorrigidoPeriodo = fluxo_saldoInicialPeriodo + fluxo_correcaoPeriodo;
        if (sistemaFinanciamento === "PRICE") {
            if (boolCorrige) {
                parcelaMesCorrente = parcelaMesAnterior * (1 + correcaoLatente);
            } else {
                parcelaMesCorrente = parcelaMesAnterior;
            }
        } else if (sistemaFinanciamento === "SAC") {
            parcelaMesCorrente = fluxo_saldoParcialCorrigidoPeriodo / (numeroPrestacoes - i) + taxaDeJuros * fluxo_saldoParcialCorrigidoPeriodo;
        }
        indiceDoMesAnterior = i === 0 ? 0 : indiceDoMes;
        boolCorrigeMesAnterior = i === 0 ? 0 : boolCorrige;
        correcaoLatenteMesAnterior = correcaoLatente;

        fluxo_jurosIncorridosPeriodo = fluxo_saldoParcialCorrigidoPeriodo * taxaDeJuros;
        fluxo_saldoParcialCorrigidoComJurosPeriodo = fluxo_saldoParcialCorrigidoPeriodo + fluxo_jurosIncorridosPeriodo;
        fluxo_jurosPagosPeriodo = -fluxo_jurosIncorridosPeriodo;
        fluxo_amortizacaoPeriodo = -parcelaMesCorrente - fluxo_jurosPagosPeriodo;
        fluxo_saldoFinalPeriodo = fluxo_saldoParcialCorrigidoComJurosPeriodo + fluxo_jurosPagosPeriodo + fluxo_amortizacaoPeriodo;

        fluxoFinanciamento.push({
            periodoN,
            periodoCalendario,
            boolCorrige,
            parcelaMesAnterior,
            indiceDoMes,
            correcaoPeriodo,
            correcaoLatente,
            parcelaMesCorrente,
            fluxo_saldoInicialPeriodo,
            fluxo_correcaoPeriodo,
            fluxo_saldoParcialCorrigidoPeriodo,
            fluxo_jurosIncorridosPeriodo,
            fluxo_saldoParcialCorrigidoComJurosPeriodo,
            fluxo_jurosPagosPeriodo,
            fluxo_amortizacaoPeriodo,
            fluxo_saldoFinalPeriodo,
        });
    }
    return fluxoFinanciamento;
}

function retornaParcelaNaData(fluxoFinanciamento, data) {
    const fluxoNaData = fluxoFinanciamento.filter((a) => a.periodoCalendario === data);
    return fluxoNaData.parcelaMesCorrente;
}

function retornaSomaValorPagoNoIntervalo(fluxoFinanciamento, mesInicialIntervalo, mesFinalIntervalo) {
    const fluxoDentroDoIntervalo = fluxoFinanciamento.filter((fluxo) => fluxo.periodoCalendario >= mesInicialIntervalo && fluxo.periodoCalendario <= mesFinalIntervalo);
    const somaValorPago = fluxoDentroDoIntervalo.reduce((acc, fluxoMes) => acc - fluxoMes.fluxo_jurosPagosPeriodo - fluxoMes.fluxo_amortizacaoPeriodo, 0);
    return somaValorPago;
}

function retornaSaldoDevedorNaData(fluxoFinanciamento, data) {
    const fluxoNaData = fluxoFinanciamento.filter((a) => a.periodoCalendario === data);
    return fluxoNaData.fluxo_saldoFinalPeriodo;
}

function incrementaUmMesCalendario(periodoCalendario) {
    const [ano, mes, dia] = dateString.split("-").map(Number);
    const date = new Date(ano, mes - 1, dia);

    date.setMonth(date.getMonth() + 1);

    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, "0"); // dois caracteres
    const newDay = String(date.getDate()).padStart(2, "0"); //dois caracteres

    return `${newYear}-${newMonth}-${newDay}`;
}
export default {
    createProcessaDadosFinanciamento,
};
