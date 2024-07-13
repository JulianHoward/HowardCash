
const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/admin.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listAdmins);
    router.get("/:id", checkUserMiddleware, controller.getAdmin);
    router.post("/", checkUserMiddleware, controller.createAdmin);
    router.put("/:id", checkUserMiddleware, controller.updateAdmin);
    router.patch("/:id", checkUserMiddleware, controller.updateAdmin);
    router.delete("/:id", checkUserMiddleware, controller.deleteAdmin);

    app.use("/api/admins", router);
}
