
const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/billetera.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listBilleteras);
    router.get("/:id", checkUserMiddleware, controller.getBilletera);
    router.get("/user/:id", checkUserMiddleware, controller.getBilleterasByUsuarioId);
    router.post("/", checkUserMiddleware, controller.createBilletera);
    router.put("/:id", checkUserMiddleware, controller.updateBilletera);
    router.patch("/:id", checkUserMiddleware, controller.updateBilletera);
    router.delete("/:id", checkUserMiddleware, controller.deleteBilletera);


    app.use("/api/billeteras", router);
}
