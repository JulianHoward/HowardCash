
const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");

exports.listTarjetas = async (req, res) => {
    try {
        const tarjetas = await db.tarjetas.findAll();
        res.send(tarjetas);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getTarjeta = async (req, res) => {
    const id = req.params.id;
    try {
        const tarjeta = await db.tarjetas.findByPk(id);
        if (!tarjeta) {
            res.status(404).send({ message: "Tarjeta no encontrada" });
            return;
        }
        res.send(tarjeta);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.createTarjeta = async (req, res) => {
    const requiredFields = ["tarjeta_usuario_id", "numero", "cvv", "fecha_vencimiento"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const tarjeta = await db.tarjetas.create(req.body);
        res.send(tarjeta);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.updateTarjeta = async (req, res) => {
    const id = req.param.id;
    try {
        const tarjeta = await db.tarjetas.findByPk(id);
        if (!tarjeta) {
            res.status(404).send({ message: "Tarjeta no encontrada" });
            return;
        }
        if (req.method === "PUT") {
            const requiredFields = ["tarjeta_usuario_id", "numero", "cvv", "fecha_vencimiento"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
                });
                return;
            }
            await tarjeta.update(req.body);
            res.send(tarjeta);
        }
    } catch (error) {
        sendError500(res, error);
    }
}

exports.deleteTarjeta = async (req, res) => {
    const id = req.params.id;
    try {
        const tarjeta = await db.tarjetas.findByPk(id);
        if (!tarjeta) {
            res.status(404).send({ message: "Tarjeta no encontrada" });
            return;
        }
        await tarjeta.destroy();
        res.send({ message: "Tarjeta eliminada" });
    } catch (error) {
        sendError500(res, error);
    }
}
