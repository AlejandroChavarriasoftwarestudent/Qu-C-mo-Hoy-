import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import alimentoRoutes from "./src/routes/alimentoRoutes.js";

import conectarDB from "./src/config/database.js";

dotenv.config();

const app = express();


// Configuración de Express
app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/alimentos", alimentoRoutes);

// Ruta de prueba
app.get("/api/estado", (req, res) => {
    res.json({
        mensaje: "El backend está funcionando correctamente"
    });
});

// Iniciar servidor
const iniciarServidor = async () => {

    await conectarDB();

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
        console.log(`Servidor funcionando en el puerto ${PORT}`);
    });

};

iniciarServidor();