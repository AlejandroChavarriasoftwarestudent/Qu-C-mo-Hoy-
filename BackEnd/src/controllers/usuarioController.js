import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// REGISTRAR USUARIO
export const registrarUsuario = async (req, res) => {

    try {

        const {
            nombre,
            apellido,
            correo,
            nombreUsuario,
            password
        } = req.body;

        // Validar campos
        const campos = [nombre, apellido, correo, nombreUsuario, password];

        if (campos.some(campo => typeof campo !== "string" || !campo.trim())) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener mínimo 8 caracteres"
            });
        }

        const correoLimpio = correo.trim().toLowerCase();
        const usuarioLimpio = nombreUsuario.trim().toLowerCase();

        // Comprobar si ya existe
        const existeUsuario = await Usuario.findOne({
            $or: [
                { correo: correoLimpio },
                { nombreUsuario: usuarioLimpio }
            ]
        });

        if (existeUsuario) {
            return res.status(409).json({
                mensaje: "El correo o nombre de usuario ya existe"
            });
        }

        // Proteger contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Guardar usuario
        const nuevoUsuario = await Usuario.create({

            nombre: nombre.trim(),
            apellido: apellido.trim(),
            correo: correoLimpio,
            nombreUsuario: usuarioLimpio,
            passwordHash

        });

        const token = jwt.sign(
            { id: nuevoUsuario._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({

            mensaje: "Usuario registrado correctamente",

            token,

            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                apellido: nuevoUsuario.apellido,
                correo: nuevoUsuario.correo,
                nombreUsuario: nuevoUsuario.nombreUsuario
            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al registrar el usuario"
        });

    }

};


// INICIAR SESIÓN
export const iniciarSesion = async (req, res) => {

    try {

        const { identificador, password } = req.body;

        if (
            typeof identificador !== "string" ||
            typeof password !== "string" ||
            !identificador.trim() ||
            !password
        ) {
            return res.status(400).json({
                mensaje: "Debes ingresar usuario y contraseña"
            });
        }

        const dato = identificador.trim().toLowerCase();

        // Buscar por correo o nombre de usuario
        const usuario = await Usuario.findOne({

            $or: [
                { correo: dato },
                { nombreUsuario: dato }
            ]

        }).select("+passwordHash");

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        // Comparar contraseña
        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.passwordHash
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        // Crear token
        const token = jwt.sign(

            { id: usuario._id },

            process.env.JWT_SECRET,

            { expiresIn: "1d" }

        );

        res.json({

            mensaje: "Inicio de sesión exitoso",

            token,

            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                nombreUsuario: usuario.nombreUsuario
            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });

    }

};


// CONSULTAR PERFIL
export const obtenerPerfil = async (req, res) => {

    try {

        const usuario = await Usuario.findById(req.usuarioId);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.json({
            usuario
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al consultar el perfil"
        });

    }

};