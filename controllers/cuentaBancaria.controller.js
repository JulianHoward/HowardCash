
const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");

exports.listCuentasBancarias = async (req, res) => {
    try {
        const cuentasBancarias = await db.cuentasBancarias.findAll();
        res.send(cuentasBancarias);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getCuentaBancaria = async (req, res) => {
    const id = req.params.id;
    try {
        const cuentaBancaria = await db.cuentasBancarias.findByPk(id);
        if (!cuentaBancaria) {
            res.status(404).send({ message: "Cuenta bancaria no encontrada" });
            return;
        }
        res.send(cuentaBancaria);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.createCuentaBancaria = async (req, res) => {
    const requiredFields = ["usuario_id_fk", "numero_cuenta", "nombre_titular", "documento_identidad",
        "banco", "moneda_id_fk"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const cuentaBancaria = await db.cuentasBancarias.create(req.body);
        res.send(cuentaBancaria);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.updateCuentaBancaria = async (req, res) => {
    const id = req.param.id;
    try {
        const cuentaBancaria = await db.cuentasBancarias.findByPk(id);
        if (!cuentaBancaria) {
            res.status(404).send({ message: "Cuenta bancaria no encontrada" });
            return;
        }
        if (req.method === "PUT") {
            const requiredFields = ["usuario_id_fk", "numero_cuenta", "nombre_titular", "documento_identidad",
                "banco", "moneda_id_fk"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
                });
                return;
            }
        }
        await cuentaBancaria.update(req.body);
        res.send(cuentaBancaria);
    }
    catch (error) {
        sendError500(res, error);
    }
}

exports.deleteCuentaBancaria = async (req, res) => {
    const id = req.params.id;
    try {
        const cuentaBancaria = await db.cuentasBancarias.findByPk(id);
        if (!cuentaBancaria) {
            res.status(404).send({ message: "Cuenta bancaria no encontrada" });
            return;
        }
        await cuentaBancaria.destroy();
        res.send({ message: "Cuenta bancaria eliminada" });
    } catch (error) {
        sendError500(res, error);
    }
}
