
const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/moneda.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listMonedas);
    router.get("/:id", checkUserMiddleware, controller.getMoneda);
    router.post("/", checkUserMiddleware, controller.createMoneda);
    router.put("/:id", checkUserMiddleware, controller.updateMoneda);
    router.patch("/:id", checkUserMiddleware, controller.updateMoneda);
    router.delete("/:id", checkUserMiddleware, controller.deleteMoneda);

    app.use("/api/monedas", router);
}
