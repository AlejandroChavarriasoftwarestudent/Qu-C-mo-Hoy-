import express from "express";

import {
    registrarUsuario,
    iniciarSesion,
    obtenerPerfil
} from "../controllers/usuarioController.js";

import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

// Registrar
router.post("/registro", registrarUsuario);

// Iniciar sesión
router.post("/login", iniciarSesion);

// Consultar perfil
router.get("/perfil", verificarToken, obtenerPerfil);

export default router;