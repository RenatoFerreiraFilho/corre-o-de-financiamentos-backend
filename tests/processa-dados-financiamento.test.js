import request from "supertest";
import app from "../index.js";
import db from "../repositories/ProcessaDadosFinanciamento.repository.js";

import ipca from "../mocks/ipca.json";
import incc from "../mocks/incc.json";
import igpm from "../mocks/igpm.json";

jest.mock("../repositories/ProcessaDadosFinanciamento.repository.js");

describe("POST /processa-dados-financiamento >> Verificando consistência dos dados retornados", () => {
    it("Combinação PRICE / IPCA / anual / 180: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(ipca);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "price",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "ipca",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "254770.32",
            parcelaCincoAnosAtras: "2638.44",
            valorPagoCincoAnosAtras: "137708.31",
            saldoDevedorCincoAnosAtras: "250032.88",
            parcelaDezAnosAtras: "3500.64",
            valorPagoDezAnosAtras: "324245.29",
            saldoDevedorDezAnosAtras: "186002.69",
            parcelaQuinzeAnosAtras: "4668.71",
            valorPagoQuinzeAnosAtras: "569913.02",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação PRICE / IGPM / anual / 180: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "price",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "254770.32",
            parcelaCincoAnosAtras: "3054.34",
            valorPagoCincoAnosAtras: "164930.16",
            saldoDevedorCincoAnosAtras: "289446.77",
            parcelaDezAnosAtras: "4003.58",
            valorPagoDezAnosAtras: "352998.55",
            saldoDevedorDezAnosAtras: "212725.76",
            parcelaQuinzeAnosAtras: "5470.97",
            valorPagoQuinzeAnosAtras: "620802.62",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação SAC / IPCA / anual / 180: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(ipca);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "ipca",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "207691.24",
            parcelaCincoAnosAtras: "2272.55",
            valorPagoCincoAnosAtras: "127629.68",
            saldoDevedorCincoAnosAtras: "182659.96",
            parcelaDezAnosAtras: "2521.50",
            valorPagoDezAnosAtras: "274832.58",
            saldoDevedorDezAnosAtras: "121175.54",
            parcelaQuinzeAnosAtras: "2704.44",
            valorPagoQuinzeAnosAtras: "433032.12",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação SAC / IGPM / anual / 180: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "207691.24",
            parcelaCincoAnosAtras: "2630.78",
            valorPagoCincoAnosAtras: "152506.30",
            saldoDevedorCincoAnosAtras: "211453.53",
            parcelaDezAnosAtras: "2883.77",
            valorPagoDezAnosAtras: "296299.07",
            saldoDevedorDezAnosAtras: "138584.87",
            parcelaQuinzeAnosAtras: "3169.17",
            valorPagoQuinzeAnosAtras: "465162.29",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação PRICE / IPCA / mensal / 180: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(ipca);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "mensal",
            taxaDeJuros: 0.01,
            sistemaFinanciamento: "price",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 1000,
            indiceCorrecao: "ipca",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "83321.66",
            parcelaCincoAnosAtras: "1319.22",
            valorPagoCincoAnosAtras: "68854.16",
            saldoDevedorCincoAnosAtras: "91950.16",
            parcelaDezAnosAtras: "1750.32",
            valorPagoDezAnosAtras: "162122.65",
            saldoDevedorDezAnosAtras: "78685.81",
            parcelaQuinzeAnosAtras: "2334.35",
            valorPagoQuinzeAnosAtras: "284956.51",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação PRICE / IGPM / mensal / 180: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "mensal",
            taxaDeJuros: 0.01,
            sistemaFinanciamento: "price",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 1000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "83321.66",
            parcelaCincoAnosAtras: "1527.17",
            valorPagoCincoAnosAtras: "82465.08",
            saldoDevedorCincoAnosAtras: "106444.71",
            parcelaDezAnosAtras: "2001.79",
            valorPagoDezAnosAtras: "176499.27",
            saldoDevedorDezAnosAtras: "89990.63",
            parcelaQuinzeAnosAtras: "2735.48",
            valorPagoQuinzeAnosAtras: "310401.31",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação SAC / IPCA / mensal / 180: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(ipca);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "mensal",
            taxaDeJuros: 0.01,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 1000,
            indiceCorrecao: "ipca",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "64285.71",
            parcelaCincoAnosAtras: "1041.24",
            valorPagoCincoAnosAtras: "61197.07",
            saldoDevedorCincoAnosAtras: "56537.90",
            parcelaDezAnosAtras: "1006.44",
            valorPagoDezAnosAtras: "124582.08",
            saldoDevedorDezAnosAtras: "37506.91",
            parcelaQuinzeAnosAtras: "842.03",
            valorPagoQuinzeAnosAtras: "180963.31",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação SAC / IGPM / mensal / 180: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "mensal",
            taxaDeJuros: 0.01,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 1000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "64285.71",
            parcelaCincoAnosAtras: "1205.38",
            valorPagoCincoAnosAtras: "73026.24",
            saldoDevedorCincoAnosAtras: "65450.24",
            parcelaDezAnosAtras: "1151.03",
            valorPagoDezAnosAtras: "133422.70",
            saldoDevedorDezAnosAtras: "42895.54",
            parcelaQuinzeAnosAtras: "986.73",
            valorPagoQuinzeAnosAtras: "192155.92",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação PRICE / IPCA / anual / 24: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(ipca);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "price",
            numeroPrestacoes: 24,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "ipca",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "45639.52",
            parcelaCincoAnosAtras: "0.00",
            valorPagoCincoAnosAtras: "49385.41",
            saldoDevedorCincoAnosAtras: "0.00",
            parcelaDezAnosAtras: "0.00",
            valorPagoDezAnosAtras: "51631.55",
            saldoDevedorDezAnosAtras: "0.00",
            parcelaQuinzeAnosAtras: "0.00",
            valorPagoQuinzeAnosAtras: "50255.52",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação PRICE / IGPM / anual / 24: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "price",
            numeroPrestacoes: 24,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "45639.52",
            parcelaCincoAnosAtras: "0.00",
            valorPagoCincoAnosAtras: "53549.87",
            saldoDevedorCincoAnosAtras: "0.00",
            parcelaDezAnosAtras: "0.00",
            valorPagoDezAnosAtras: "49953.11",
            saldoDevedorDezAnosAtras: "0.00",
            parcelaQuinzeAnosAtras: "0.00",
            valorPagoQuinzeAnosAtras: "49911.15",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação SAC / IPCA / anual / 24: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(ipca);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 24,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "ipca",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "43724.65",
            parcelaCincoAnosAtras: "0.00",
            valorPagoCincoAnosAtras: "47248.36",
            saldoDevedorCincoAnosAtras: "0.00",
            parcelaDezAnosAtras: "0.00",
            valorPagoDezAnosAtras: "49359.37",
            saldoDevedorDezAnosAtras: "0.00",
            parcelaQuinzeAnosAtras: "0.00",
            valorPagoQuinzeAnosAtras: "48071.52",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação SAC / IGPM / anual / 24: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 24,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "43724.65",
            parcelaCincoAnosAtras: "0.00",
            valorPagoCincoAnosAtras: "51127.41",
            saldoDevedorCincoAnosAtras: "0.00",
            parcelaDezAnosAtras: "0.00",
            valorPagoDezAnosAtras: "47762.11",
            saldoDevedorDezAnosAtras: "0.00",
            parcelaQuinzeAnosAtras: "0.00",
            valorPagoQuinzeAnosAtras: "47726.19",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação PRICE / IPCA / mensal / 24: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(ipca);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "mensal",
            taxaDeJuros: 0.01,
            sistemaFinanciamento: "price",
            numeroPrestacoes: 24,
            valorPrimeiraParcela: 1000,
            indiceCorrecao: "ipca",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "21243.39",
            parcelaCincoAnosAtras: "0.00",
            valorPagoCincoAnosAtras: "24692.70",
            saldoDevedorCincoAnosAtras: "0.00",
            parcelaDezAnosAtras: "0.00",
            valorPagoDezAnosAtras: "25815.78",
            saldoDevedorDezAnosAtras: "0.00",
            parcelaQuinzeAnosAtras: "0.00",
            valorPagoQuinzeAnosAtras: "25127.76",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação PRICE / IGPM / mensal / 24: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "mensal",
            taxaDeJuros: 0.01,
            sistemaFinanciamento: "price",
            numeroPrestacoes: 24,
            valorPrimeiraParcela: 1000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "21243.39",
            parcelaCincoAnosAtras: "0.00",
            valorPagoCincoAnosAtras: "26774.94",
            saldoDevedorCincoAnosAtras: "0.00",
            parcelaDezAnosAtras: "0.00",
            valorPagoDezAnosAtras: "24976.56",
            saldoDevedorDezAnosAtras: "0.00",
            parcelaQuinzeAnosAtras: "0.00",
            valorPagoQuinzeAnosAtras: "24955.58",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação SAC / IPCA / mensal / 24: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(ipca);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "mensal",
            taxaDeJuros: 0.01,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 24,
            valorPrimeiraParcela: 1000,
            indiceCorrecao: "ipca",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "19354.84",
            parcelaCincoAnosAtras: "0.00",
            valorPagoCincoAnosAtras: "22370.80",
            saldoDevedorCincoAnosAtras: "0.00",
            parcelaDezAnosAtras: "0.00",
            valorPagoDezAnosAtras: "23347.05",
            saldoDevedorDezAnosAtras: "0.00",
            parcelaQuinzeAnosAtras: "0.00",
            valorPagoQuinzeAnosAtras: "22754.85",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
    it("Combinação SAC / IGPM / mensal / 24: deve retornar resultados consistentes para as premissas informadas", async () => {
        db.getIndiceInflacao.mockReturnValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "mensal",
            taxaDeJuros: 0.01,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 24,
            valorPrimeiraParcela: 1000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            valorFinanciado: "19354.84",
            parcelaCincoAnosAtras: "0.00",
            valorPagoCincoAnosAtras: "24142.94",
            saldoDevedorCincoAnosAtras: "0.00",
            parcelaDezAnosAtras: "0.00",
            valorPagoDezAnosAtras: "22596.03",
            saldoDevedorDezAnosAtras: "0.00",
            parcelaQuinzeAnosAtras: "0.00",
            valorPagoQuinzeAnosAtras: "22581.62",
            saldoDevedorQuinzeAnosAtras: "0.00",
        });
    });
});

describe("POST /processa-dados-financiamento >> Verificando consistência das variáveis recebidas", () => {
    it("Deve dar erro 400, porque não está recebendo nenhuma variável", async () => {
        db.getIndiceInflacao.mockResolvedValueOnce(ipca);

        const response = await request(app).post("/processa-dados-financiamento").send({});
        expect(response.status).toBe(400);
    });

    it("Deve retornar mensagem de erro avisando que o tipo de taxa de juros informado é inválido", async () => {
        db.getIndiceInflacao.mockResolvedValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "m",
            taxaDeJuros: 0.12,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            error: "Tipo da taxa de juros informado inválido.",
        });
    });

    it("Deve retornar mensagem de erro avisando que a taxa de juros informada é inválida", async () => {
        db.getIndiceInflacao.mockResolvedValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: "m",
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            error: "Taxa de juros inválida.",
        });
    });

    it("Deve retornar mensagem de erro avisando que o sistema de financiamento informado é inválido", async () => {
        db.getIndiceInflacao.mockResolvedValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "s",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            error: "Sistema de financiamento informado inválido.",
        });
    });

    it("Deve retornar mensagem de erro avisando que o número de prestacoes informado é inválido", async () => {
        db.getIndiceInflacao.mockResolvedValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: "180",
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            error: "Número de prestações inválido.",
        });
    });

    it("Deve retornar mensagem de erro avisando que o valor da primeira parcela é inválido", async () => {
        db.getIndiceInflacao.mockResolvedValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: "2000",
            indiceCorrecao: "igpm",
        });
        expect(response.body).toStrictEqual({
            error: "Valor da primeira parcela inválido.",
        });
    });

    it("Deve retornar mensagem de erro avisando que o índice de correção é inválido", async () => {
        db.getIndiceInflacao.mockResolvedValueOnce(igpm);

        const response = await request(app).post("/processa-dados-financiamento").send({
            tipoTaxaDeJuros: "anual",
            taxaDeJuros: 0.05,
            sistemaFinanciamento: "sac",
            numeroPrestacoes: 180,
            valorPrimeiraParcela: 2000,
            indiceCorrecao: "ig",
        });
        expect(response.body).toStrictEqual({
            error: "Índice de correção informado inválido.",
        });
    });
});
