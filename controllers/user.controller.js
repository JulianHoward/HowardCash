const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");

exports.listUsers = async (req, res) => {
  console.log("Usuario actual", res.locals.user.correo);
  try {
    const users = await db.usuarios.findAll();
    res.send(users);
  } catch (error) {
    console.log("MAL USERS")
    sendError500(res, error);
  }
};

exports.getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await db.usuarios.findByPk(id);
    if (!user) {
      res.status(404).send({ message: "Usuario no encontrado" });
      return;
    }
    res.send(user);
  } catch (error) {
    sendError500(res, error);
  }
};

exports.createUser = async (req, res) => {
  const requiredFields = ["correo", "password"];
  const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
  if (fieldsWithErrors.length > 0) {
    res.status(400).send({
      message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
    });
    return;
  }
  try {
    const user = await db.usuarios.create(req.body);
    res.send(user);
  } catch (error) {
    sendError500(res, error);
  }
};

exports.updateUser = async (req, res) => {
  const id = req.param.id;
  try {
    const user = await db.usuarios.findByPk(id);
    if (!user) {
      res.status(404).send({ message: "Usuario no encontrado" });
      return;
    }
    if (req.method === "PUT") {
      const requiredFields = ["nombre", "apellido", "correo", "password"];
      const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
      if (fieldsWithErrors.length > 0) {
        res.status(400).send({
          message: `Faltan los siguientes campos: ${fieldsWithErrors.join(
            ", "
          )}`,
        });
        return;
      }
      await user.update(req.body);
      res.send(user);
    }
  } catch (error) {
    sendError500(res, error);
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await db.usuarios.findByPk(id);
    if (!user) {
      res.status(404).send({ message: "Usuario no encontrado" });
      return;
    }
    await user.destroy();
    res.send({ message: "Usuario eliminado" });
  } catch (error) {
    sendError500(res, error);
  }
};
