
const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");

exports.listBeneficiarios = async (req, res) => {
    try {
        const beneficiarios = await db.beneficiarios.findAll();
        res.send(beneficiarios);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getBeneficiario = async (req, res) => {
    const id = req.params.id;
    try {
        const beneficiario = await db.beneficiarios.findByPk(id);
        if (!beneficiario) {
            res.status(404).send({ message: "Beneficiario no encontrado" });
            return;
        }
        res.send(beneficiario);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.createBeneficiario = async (req, res) => {
    const requiredFields = ["usuario_id_fk", "nombre_referencia", "codigo_billetera_fk"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const beneficiario = await db.beneficiarios.create(req.body);
        res.send(beneficiario);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.updateBeneficiario = async (req, res) => {
    const id = req.param.id;

    const requiredFields = ["usuario_id_fk", "nombre_referencia", "codigo_billetera_fk"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }

    try {
        const beneficiario = await db.beneficiarios.update(req.body, { where: { id: id } });
        res.send(beneficiario);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.deleteBeneficiario = async (req, res) => {
    const id = req.params.id;
    try {
        const beneficiario = await db.beneficiarios.findByPk(id);
        if (!beneficiario) {
            res.status(404).send({ message: "Beneficiario no encontrado" });
            return;
        }
        await beneficiario.destroy();
        res.send({ message: "Beneficiario eliminado" });
    } catch (error) {
        sendError500(res, error);
    }
}
