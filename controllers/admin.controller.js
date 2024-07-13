
const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");

exports.listAdmins = async (req, res) => {
    console.log("Admin actual", res.local.admin.correo);
    try {
        const admins = await db.admins.findAll();
        res.send(admins);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getAdmin = async (req, res) => {
    const id = req.params.id;
    try {
        const admin = await db.admins.findByPk(id);
        if (!admin) {
            res.status(404).send({ message: "Admin no encontrado" });
            return;
        }
        res.send(admin);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.createAdmin = async (req, res) => {
    const requiredFields = ["correo", "password"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const admin = await db.admins.create(req.body);
        res.send(admin);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.updateAdmin = async (req, res) => {
    const id = req.param.id;
    try {
        const admin = await db.admins.findByPk(id);
        if (!admin) {
            res.status(404).send({ message: "Admin no encontrado" });
            return;
        }
        if (req.method === "PUT") {
            const requiredFields = ["correo", "password"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
                });
                return;
            }
        }
        await admin.update(req.body);
        res.send(admin);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.deleteAdmin = async (req, res) => {
    const id = req.params.id;
    try {
        const admin = await db.admins.findByPk(id);
        if (!admin) {
            res.status(404).send({ message: "Admin no encontrado" });
            return;
        }
        await admin.destroy();
        res.send({ message: "Admin eliminado" });
    } catch (error) {
        sendError500(res, error);
    }
}
