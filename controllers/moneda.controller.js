
const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");

exports.listMonedas = async (req, res) => {
    try {
        const monedas = await db.monedas.findAll();
        res.send(monedas);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getMoneda = async (req, res) => {
    const id = req.params.id;
    try {
        const moneda = await db.monedas.findByPk(id);
        if (!moneda) {
            res.status(404).send({ message: "Moneda no encontrada" });
            return;
        }
        res.send(moneda);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.createMoneda = async (req, res) => {
    const requiredFields = ["nombre", "simbolo", "valor_usd"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const moneda = await db.monedas.create(req.body);
        res.send(moneda);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.updateMoneda = async (req, res) => {
    const id = req.params.id;
    try {
        const moneda = await db.monedas.findByPk(id);
        if (!moneda) {
            res.status(404).send({ message: "Moneda no encontrada" });
            return;
        }
        if (req.method === "PUT") {
            const requiredFields = ["nombre", "simbolo", "valor_usd"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
                });
                return;
            }
            await moneda.update(req.body);
            res.send(moneda);
        }
    } catch (error) {
        sendError500(res, error);
    }
}

exports.deleteMoneda = async (req, res) => {
    const id = req.params.id;
    try {
        const moneda = await db.monedas.findByPk(id);
        if (!moneda) {
            res.status(404).send({ message: "Moneda no encontrada" });
            return;
        }
        await moneda.destroy();
        res.send({ message: "Moneda eliminada" });
    } catch (error) {
        sendError500(res, error);
    }
}
