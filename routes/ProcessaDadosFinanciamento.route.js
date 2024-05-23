import express from "express";
import ProcessaDadosFinanciamentoController from "../controllers/ProcessaDadosFinanciamento.controller.js";

const router = express.Router();

router.post("/", ProcessaDadosFinanciamentoController.createProcessaDadosFinanciamento);

export default router;
