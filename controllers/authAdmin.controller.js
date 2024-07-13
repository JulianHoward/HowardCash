

const db = require("../models");
const { generarTokenUsuario } = require("../utils/code.utils");
const { stringToSha1 } = require("../utils/crypto.utils");
const { checkRequiredFields } = require("../utils/request.utils");

exports.generateAdminToken = async (req, res) => {
    const requiredFields = ["correo", "password"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message:
                `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
        });
        return;
    }

    const { correo, password } = req.body;

    const admin = await db.admins.findOne({
        where: {
            correo,
            password: stringToSha1(password)
        }
    });
    if (!admin) {
        res.status(401).send({ message: "Admin o contraseña incorrectos" });
        return;
    }
    const token = generarTokenUsuario();
    await db.adminAuths.create({
        token,
        admin_id: admin.id
    });
    res.send({ token });
}

exports.registerAdmin = async (req, res) => {
    const requiredFields = ["correo", "password"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message:
                `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
        });
        return;
    }
    const { correo, password } = req.body;
    const adminDB = await db.admins.findOne({
        where: {
            correo
        }
    });
    if (adminDB) {
        res.status(400).send({
            message: "El correo ya está registrado"
        });
        return;
    }
    const admin = await db.admins.create({
        correo,
        password: stringToSha1(password)
    });
    admin.password = undefined;
    res.send(admin);
}

exports.meAdmin = async (req, res) => {
    console.log("Admin actual", res.locals.user)
    const persona = await db.admins.findOne({
        where: {
            admin_id: res.locals.user.id
        }
    });
    res.send(persona);
}