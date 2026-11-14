import express from "express";
import {
    editarAlimento,
    eliminarAlimento,
    obtenerAlimentosDeHoy,
    obtenerHistorial,
    registrarAlimento
} from "../controllers/alimentoController.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verificarToken);
router.post("/", registrarAlimento);
router.get("/hoy", obtenerAlimentosDeHoy);
router.get("/historial", obtenerHistorial);
router.put("/:id", editarAlimento);
router.delete("/:id", eliminarAlimento);

export default router;
