import express from "express";
import ProcessaDadosFinanciamentoController from "../controllers/ProcessaDadosFinanciamento.controller.js";

const router = express.Router();

router.post("/", ProcessaDadosFinanciamentoController.createProcessaDadosFinanciamento);
router.post("/config", ProcessaDadosFinanciamentoController.createTable);

export default router;
