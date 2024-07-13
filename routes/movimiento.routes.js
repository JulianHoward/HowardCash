
const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/movimiento.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listMovimientos);
    router.get("/:id", checkUserMiddleware, controller.getMovimiento);
    router.post("/", checkUserMiddleware, controller.createMovimiento);
    router.put("/:id", checkUserMiddleware, controller.updateMovimiento);
    router.patch("/:id", checkUserMiddleware, controller.updateMovimiento);
    router.delete("/:id", checkUserMiddleware, controller.deleteMovimiento);
    router.get("/billetera/:billeteraId", checkUserMiddleware, controller.getMovimientosByBilleteraId);

    app.use("/api/movimientos", router);
}
