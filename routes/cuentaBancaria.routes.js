
const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/cuentaBancaria.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listCuentasBancarias);
    router.get("/:id", checkUserMiddleware, controller.getCuentaBancaria);
    router.post("/", checkUserMiddleware, controller.createCuentaBancaria);
    router.put("/:id", checkUserMiddleware, controller.updateCuentaBancaria);
    router.patch("/:id", checkUserMiddleware, controller.updateCuentaBancaria);
    router.delete("/:id", checkUserMiddleware, controller.deleteCuentaBancaria);

    app.use("/api/cuentas-bancarias", router);
}
