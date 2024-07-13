
const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");
const { v4: uuidv4 } = require('uuid');

exports.listBilleteras = async (req, res) => {
    try {
        const billeteras = await db.billeteras.findAll();
        res.send(billeteras);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getBilletera = async (req, res) => {
    const id = req.params.id;
    try {
        const billetera = await db.billeteras.findByPk(id);
        if (!billetera) {
            res.status(404).send({ message: "Billetera no encontrada" });
            return;
        }
        res.send(billetera);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getBilleterasByUsuarioId = (req, res) => {
    const usuarioId = req.params.usuarioId;

    db.billeteras.findAll({ where: { billetera_usuario_id: usuarioId } })
        .then(billeteras => {
            res.status(200).send(billeteras);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Ocurrió un error al recuperar las billeteras."
            });
        });
};

exports.createBilletera = async (req, res) => {
    const requiredFields = ['billetera_usuario_id', 'billetera_moneda_id'];
    const { billetera_usuario_id, billetera_moneda_id, saldo } = req.body;

    const missingFields = checkRequiredFields(requiredFields, req.body);
    if (missingFields.length > 0) {
        res.status(400).send({ message: `Faltan los siguientes campos: ${missingFields.join(", ")}` });
        return;
    }

    const existingBilletera = await db.billeteras.findOne({
        where: {
            billetera_usuario_id: billetera_usuario_id,
            billetera_moneda_id: billetera_moneda_id
        }
    });

    if(existingBilletera) {
        return res.status(400).send({ message: "Ya existe una billetera para el usuario y moneda especificados" });
    }

    const newWallet = {
        billetera_usuario_id,
        billetera_moneda_id,
        saldo,
        codigo_uuid: uuidv4()
    };

    try {
        const createdWallet = await db.billeteras.create(newWallet);
        res.status(201).send(createdWallet);
    } catch (error) {
        res.status(500).send({ message: "Error al crear la billetera", error });
    }
};

exports.updateBilletera = async (req, res) => {
    const id = req.param.id;
    try {
        const billetera = await db.billeteras.findByPk(id);
        if (!billetera) {
            res.status(404).send({ message: "Billetera no encontrada" });
            return;
        }
        if (req.method === "PUT") {
            const requiredFields = ["billetera_usuario_id", "billetera_moneda_id", "saldo", "codigo_uuid"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
                });
                return;
            }
            await billetera.update(req.body);
            res.send(billetera);
        }
    } catch (error) {
        sendError500(res, error);
    }
}

exports.deleteBilletera = async (req, res) => {
    const id = req.params.id;
    try {
        const billetera = await db.billeteras.findByPk(id);
        if (!billetera) {
            res.status(404).send({ message: "Billetera no encontrada" });
            return;
        }
        await billetera.destroy();
        res.send({ message: "Billetera eliminada" });
    } catch (error) {
        sendError500(res, error);
    }
}
