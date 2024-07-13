
const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/tarjeta.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listTarjetas);
    router.get("/:id", checkUserMiddleware, controller.getTarjeta);
    router.post("/", checkUserMiddleware, controller.createTarjeta);
    router.put("/:id", checkUserMiddleware, controller.updateTarjeta);
    router.patch("/:id", checkUserMiddleware, controller.updateTarjeta);
    router.delete("/:id", checkUserMiddleware, controller.deleteTarjeta);

    app.use("/api/tarjetas", router);
}
