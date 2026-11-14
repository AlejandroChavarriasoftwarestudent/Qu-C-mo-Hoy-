import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {

    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {

        return res.status(401).json({
            mensaje: "No tienes autorización"
        });

    }

    const token = authorization.split(" ")[1];

    try {

        const decodificado = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuarioId = decodificado.id;

        next();

    } catch (error) {

        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });

    }

};