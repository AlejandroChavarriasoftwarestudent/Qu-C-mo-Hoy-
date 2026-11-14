import mongoose from "mongoose";
import Alimento from "../models/Alimento.js";

const TIPOS_COMIDA = ["Desayuno", "Almuerzo", "Cena", "Refrigerio"];

const esFechaValida = (fecha) => {
    if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return false;
    }

    const [anio, mes, dia] = fecha.split("-").map(Number);
    const fechaCalendario = new Date(Date.UTC(anio, mes - 1, dia));

    return fechaCalendario.getUTCFullYear() === anio
        && fechaCalendario.getUTCMonth() === mes - 1
        && fechaCalendario.getUTCDate() === dia;
};

const obtenerCampos = (body, parcial = false) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { error: "El cuerpo de la solicitud debe ser un objeto JSON" };
    }

    const campos = {};

    if (!parcial || Object.hasOwn(body, "nombre")) {
        if (typeof body.nombre !== "string" || !body.nombre.trim()) {
            return { error: "El nombre del alimento es obligatorio" };
        }
        if (body.nombre.trim().length > 120) {
            return { error: "El nombre no puede superar 120 caracteres" };
        }
        campos.nombre = body.nombre.trim();
    }

    if (!parcial || Object.hasOwn(body, "tipoComida")) {
        if (!TIPOS_COMIDA.includes(body.tipoComida)) {
            return { error: "Selecciona un tipo de comida válido" };
        }
        campos.tipoComida = body.tipoComida;
    }

    if (!parcial || Object.hasOwn(body, "fecha")) {
        if (!esFechaValida(body.fecha)) {
            return { error: "La fecha debe ser válida y tener formato AAAA-MM-DD" };
        }
        campos.fecha = body.fecha;
    }

    if (Object.hasOwn(body, "notas")) {
        if (typeof body.notas !== "string") {
            return { error: "Las notas deben ser texto" };
        }
        if (body.notas.length > 500) {
            return { error: "Las notas no pueden superar 500 caracteres" };
        }
        campos.notas = body.notas.trim();
    } else if (!parcial) {
        campos.notas = "";
    }

    return { campos };
};

export const registrarAlimento = async (req, res) => {
    const { campos, error } = obtenerCampos(req.body);
    if (error) {
        return res.status(400).json({ mensaje: error });
    }

    try {
        const alimento = await Alimento.create({
            ...campos,
            usuarioId: req.usuarioId
        });

        return res.status(201).json({ alimento });
    } catch (error) {
        console.error("Error al registrar alimento:", error.message);
        return res.status(500).json({ mensaje: "Error al registrar el alimento" });
    }
};

export const obtenerAlimentosDeHoy = async (req, res) => {
    const fecha = req.query.fecha || new Date().toISOString().slice(0, 10);
    if (!esFechaValida(fecha)) {
        return res.status(400).json({ mensaje: "La fecha solicitada no es válida" });
    }

    try {
        const alimentos = await Alimento.find({
            usuarioId: req.usuarioId,
            fecha
        }).sort({ createdAt: -1 });

        return res.json({ alimentos });
    } catch (error) {
        console.error("Error al consultar alimentos de hoy:", error.message);
        return res.status(500).json({ mensaje: "Error al consultar la alimentación del día" });
    }
};

export const obtenerHistorial = async (req, res) => {
    try {
        const alimentos = await Alimento.find({
            usuarioId: req.usuarioId
        }).sort({ fecha: -1, createdAt: -1 });

        return res.json({ alimentos });
    } catch (error) {
        console.error("Error al consultar historial de alimentos:", error.message);
        return res.status(500).json({ mensaje: "Error al consultar el historial" });
    }
};

export const editarAlimento = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ mensaje: "Alimento no encontrado" });
    }

    const { campos, error } = obtenerCampos(req.body, true);
    if (error) {
        return res.status(400).json({ mensaje: error });
    }
    if (Object.keys(campos).length === 0) {
        return res.status(400).json({ mensaje: "Indica al menos un campo para actualizar" });
    }

    try {
        const alimento = await Alimento.findOneAndUpdate(
            { _id: req.params.id, usuarioId: req.usuarioId },
            { $set: campos },
            { new: true, runValidators: true }
        );

        if (!alimento) {
            return res.status(404).json({ mensaje: "Alimento no encontrado" });
        }

        return res.json({ alimento });
    } catch (error) {
        console.error("Error al editar alimento:", error.message);
        return res.status(500).json({ mensaje: "Error al editar el alimento" });
    }
};

export const eliminarAlimento = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ mensaje: "Alimento no encontrado" });
    }

    try {
        const alimento = await Alimento.findOneAndDelete({
            _id: req.params.id,
            usuarioId: req.usuarioId
        });

        if (!alimento) {
            return res.status(404).json({ mensaje: "Alimento no encontrado" });
        }

        return res.json({ mensaje: "Alimento eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar alimento:", error.message);
        return res.status(500).json({ mensaje: "Error al eliminar el alimento" });
    }
};
