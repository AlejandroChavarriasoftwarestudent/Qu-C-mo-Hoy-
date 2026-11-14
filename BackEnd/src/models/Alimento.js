import mongoose from "mongoose";

const alimentoSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
        index: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    tipoComida: {
        type: String,
        required: true,
        enum: ["Desayuno", "Almuerzo", "Cena", "Refrigerio"]
    },
    fecha: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/
    },
    notas: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ""
    }
}, {
    timestamps: true
});

export default mongoose.model("Alimento", alimentoSchema);
