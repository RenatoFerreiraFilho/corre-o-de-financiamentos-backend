import ProcessaDadosFinanciamentoRepository from "../repositories/ProcessaDadosFinanciamento.repository.js";

async function createProcessaDadosFinanciamento(ProcessaDadosFinanciamento) {
    const taxaDeJurosMensal =
        ProcessaDadosFinanciamento.tipoTaxaDeJuros === "anual" ? mensalizaTaxaAnual(ProcessaDadosFinanciamento.taxaDeJuros) : ProcessaDadosFinanciamento.taxaDeJuros;

    const mesInicialFluxoCincoAnos = calculaMesInicial(5);
    const mesInicialFluxoDezAnos = calculaMesInicial(10);
    const mesInicialFluxoQuinzeAnos = calculaMesInicial(15);
    const valorFinanciado = calculaValorFinanciado(
        ProcessaDadosFinanciamento.sistemaFinanciamento,
        taxaDeJurosMensal,
        ProcessaDadosFinanciamento.numeroPrestacoes,
        ProcessaDadosFinanciamento.valorPrimeiraParcela
    );
    const dataAtual = "2024-03-01"; //usada para gerar o valor da parcela atual, e para parar o fluxo de financiamento
    //usar data que seja garantida a presença de índice de correção

    const indicesDeCorrecaoHistoricos = await ProcessaDadosFinanciamentoRepository.getIndiceInflacao(ProcessaDadosFinanciamento.indiceCorrecao);
    const fluxoFinanciamentoCincoAnos = await geraFluxoFinanciamento(
        dataAtual,
        valorFinanciado,
        mesInicialFluxoCincoAnos,
        ProcessaDadosFinanciamento.sistemaFinanciamento,
        taxaDeJurosMensal,
        ProcessaDadosFinanciamento.numeroPrestacoes,
        ProcessaDadosFinanciamento.indiceCorrecao,
        ProcessaDadosFinanciamento.valorPrimeiraParcela,
        indicesDeCorrecaoHistoricos
    );
    const fluxoFinanciamentoDezAnos = await geraFluxoFinanciamento(
        dataAtual,
        valorFinanciado,
        mesInicialFluxoDezAnos,
        ProcessaDadosFinanciamento.sistemaFinanciamento,
        taxaDeJurosMensal,
        ProcessaDadosFinanciamento.numeroPrestacoes,
        ProcessaDadosFinanciamento.indiceCorrecao,
        ProcessaDadosFinanciamento.valorPrimeiraParcela,
        indicesDeCorrecaoHistoricos
    );
    const fluxoFinanciamentoQuinzeAnos = await geraFluxoFinanciamento(
        dataAtual,
        valorFinanciado,
        mesInicialFluxoQuinzeAnos,
        ProcessaDadosFinanciamento.sistemaFinanciamento,
        taxaDeJurosMensal,
        ProcessaDadosFinanciamento.numeroPrestacoes,
        ProcessaDadosFinanciamento.indiceCorrecao,
        ProcessaDadosFinanciamento.valorPrimeiraParcela,
        indicesDeCorrecaoHistoricos
    );

    //Resultados para cinco anos:
    const parcelaCincoAnosAtras = retornaParcelaNaData(fluxoFinanciamentoCincoAnos, dataAtual);
    const valorPagoCincoAnosAtras = retornaSomaValorPagoNoIntervalo(fluxoFinanciamentoCincoAnos, mesInicialFluxoCincoAnos, dataAtual);
    const saldoDevedorCincoAnosAtras = retornaSaldoDevedorNaData(fluxoFinanciamentoCincoAnos, dataAtual);

    //Resultados para dez anos:
    const parcelaDezAnosAtras = retornaParcelaNaData(fluxoFinanciamentoDezAnos, dataAtual);
    const valorPagoDezAnosAtras = retornaSomaValorPagoNoIntervalo(fluxoFinanciamentoDezAnos, mesInicialFluxoDezAnos, dataAtual);
    const saldoDevedorDezAnosAtras = retornaSaldoDevedorNaData(fluxoFinanciamentoDezAnos, dataAtual);

    //Resultados para quinze anos:
    const parcelaQuinzeAnosAtras = retornaParcelaNaData(fluxoFinanciamentoQuinzeAnos, dataAtual);
    const valorPagoQuinzeAnosAtras = retornaSomaValorPagoNoIntervalo(fluxoFinanciamentoQuinzeAnos, mesInicialFluxoQuinzeAnos, dataAtual);
    const saldoDevedorQuinzeAnosAtras = retornaSaldoDevedorNaData(fluxoFinanciamentoQuinzeAnos, dataAtual);

    const resp = {
        valorFinanciado: valorFinanciado.toFixed(2),
        parcelaCincoAnosAtras: parcelaCincoAnosAtras.toFixed(2),
        valorPagoCincoAnosAtras: valorPagoCincoAnosAtras.toFixed(2),
        saldoDevedorCincoAnosAtras: saldoDevedorCincoAnosAtras.toFixed(2),
        parcelaDezAnosAtras: parcelaDezAnosAtras.toFixed(2),
        valorPagoDezAnosAtras: valorPagoDezAnosAtras.toFixed(2),
        saldoDevedorDezAnosAtras: saldoDevedorDezAnosAtras.toFixed(2),
        parcelaQuinzeAnosAtras: parcelaQuinzeAnosAtras.toFixed(2),
        valorPagoQuinzeAnosAtras: valorPagoQuinzeAnosAtras.toFixed(2),
        saldoDevedorQuinzeAnosAtras: saldoDevedorQuinzeAnosAtras.toFixed(2),
    };
    return resp;
}

function mensalizaTaxaAnual(taxaAnual) {
    return (1 + taxaAnual) ** (1 / 12) - 1;
}

function calculaMesInicial(numeroDeAnosAtras) {
    //Futuramente, implementar lógica em que a data atual fique dinâmica.
    //Para isso, será necessário abastecer o Banco de Dados dos índices de inflação dinamicamente
    if (numeroDeAnosAtras === 5) {
        return "2019-04-01";
    }
    if (numeroDeAnosAtras === 10) {
        return "2014-04-01";
    }
    if (numeroDeAnosAtras === 15) {
        return "2009-04-01";
    }
}

function calculaValorFinanciado(sistemaDeFinanciamento, taxaDeJuros, numeroPrestacoes, valorPrimeiraParcela) {
    if (sistemaDeFinanciamento === "price") {
        return (valorPrimeiraParcela * ((1 + taxaDeJuros) ** numeroPrestacoes - 1)) / ((1 + taxaDeJuros) ** numeroPrestacoes * taxaDeJuros);
    }
    if (sistemaDeFinanciamento === "sac") {
        return valorPrimeiraParcela / (1 / numeroPrestacoes + taxaDeJuros);
    }
}

async function geraFluxoFinanciamento(
    dataAtual,
    valorFinanciado,
    mesInicialDoFluxo,
    sistemaFinanciamento,
    taxaDeJuros,
    numeroPrestacoes,
    indiceDeCorrecao,
    valorPrimeiraParcela,
    indicesDeCorrecaoHistoricos
) {
    const fluxoFinanciamento = [];
    var periodoN,
        periodoCalendario,
        boolCorrige,
        boolCorrigeMesAnterior,
        parcelaMesAnterior,
        indiceDoMes,
        indiceDoMesAnterior,
        correcaoPeriodo,
        correcaoLatente,
        correcaoLatenteMesAnterior,
        parcelaMesCorrente;
    var fluxo_saldoInicialPeriodo,
        fluxo_correcaoPeriodo,
        fluxo_saldoParcialCorrigidoPeriodo,
        fluxo_jurosIncorridosPeriodo,
        fluxo_saldoParcialCorrigidoComJurosPeriodo,
        fluxo_jurosPagosPeriodo,
        fluxo_amortizacaoPeriodo,
        fluxo_saldoFinalPeriodo;

    for (var i = 0; i < numeroPrestacoes; i++) {
        periodoN = i;
        periodoCalendario = i === 0 ? mesInicialDoFluxo : incrementaUmMesCalendario(periodoCalendario);
        if (new Date(periodoCalendario) <= new Date(dataAtual)) {
            boolCorrige = i === 0 ? false : true;
            parcelaMesAnterior = i === 0 ? valorPrimeiraParcela : parcelaMesCorrente;

            indiceDoMesAnterior = i === 0 ? 0 : indiceDoMes;
            try {
                indiceDoMes = parseFloat(indicesDeCorrecaoHistoricos.filter((a) => a.date == periodoCalendario)[0][indiceDeCorrecao]);
            } catch {
                indiceDoMes = indiceDoMesAnterior;
            }
            correcaoPeriodo = i === 0 ? 0 : indiceDoMes / indiceDoMesAnterior - 1;
            correcaoLatente = i === 0 ? 0 : boolCorrigeMesAnterior === false ? (1 + correcaoLatenteMesAnterior) * (1 + correcaoPeriodo) - 1 : correcaoPeriodo;
            fluxo_saldoInicialPeriodo = i === 0 ? valorFinanciado : fluxo_saldoFinalPeriodo;
            fluxo_correcaoPeriodo = boolCorrige ? fluxo_saldoInicialPeriodo * correcaoLatente : 0;
            fluxo_saldoParcialCorrigidoPeriodo = fluxo_saldoInicialPeriodo + fluxo_correcaoPeriodo;
            if (sistemaFinanciamento === "price") {
                if (boolCorrige) {
                    parcelaMesCorrente = parcelaMesAnterior * (1 + correcaoLatente);
                } else {
                    parcelaMesCorrente = parcelaMesAnterior;
                }
            } else if (sistemaFinanciamento === "sac") {
                parcelaMesCorrente = fluxo_saldoParcialCorrigidoPeriodo / (numeroPrestacoes - i) + taxaDeJuros * fluxo_saldoParcialCorrigidoPeriodo;
            }
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
    }
    return fluxoFinanciamento;
}

function retornaParcelaNaData(fluxoFinanciamento, data) {
    const fluxoNaData = fluxoFinanciamento.filter((a) => a.periodoCalendario === data);
    if (fluxoNaData.length == 0) {
        return 0;
    } else {
        return fluxoNaData[0].parcelaMesCorrente;
    }
}

function retornaSomaValorPagoNoIntervalo(fluxoFinanciamento, mesInicialIntervalo, mesFinalIntervalo) {
    const fluxoDentroDoIntervalo = fluxoFinanciamento.filter(
        (fluxo) => new Date(fluxo.periodoCalendario) >= new Date(mesInicialIntervalo) && new Date(fluxo.periodoCalendario) <= new Date(mesFinalIntervalo)
    );
    const somaValorPago = fluxoDentroDoIntervalo.reduce((acc, fluxoMes) => {
        return acc - fluxoMes.fluxo_jurosPagosPeriodo - fluxoMes.fluxo_amortizacaoPeriodo;
    }, 0);
    return somaValorPago;
}

function retornaSaldoDevedorNaData(fluxoFinanciamento, data) {
    const fluxoNaData = fluxoFinanciamento.filter((a) => a.periodoCalendario === data);
    let saldoDevedor;
    if (fluxoNaData.length == 0) {
        saldoDevedor = 0;
    } else {
        saldoDevedor = fluxoNaData[0].fluxo_saldoFinalPeriodo;
    }
    if (Math.abs(saldoDevedor.toFixed(2) == 0)) {
        //usado para tratar problemas comuns de -0,00
        saldoDevedor = 0;
    }
    return saldoDevedor;
}

function incrementaUmMesCalendario(periodoCalendario) {
    const [ano, mes, dia] = periodoCalendario.split("-").map(Number);
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
